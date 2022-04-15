import { BadRequestException, Injectable, Type } from '@nestjs/common';
import { ObjectId, Types } from 'mongoose';
import { CATEGORY_TYPE, FIND_ROOM_FILTER_TYPE } from 'src/common/consts/enum';
import { MongoId } from 'src/common/dtos/MongoId.dto';
import { RoomIdDto } from 'src/common/dtos/RoomId.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { Room } from 'src/models/room.model';
import { User } from 'src/models/user.model';
import { RoomRepository } from 'src/repositories/room.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { CreateRoomDto } from './dto/create-room.dto';
import { FindRoomDto } from './dto/find-room.dto';
import { ResFindRoomDto } from './dto/find-room.res.dto copy';
import { ResFindOneRoomDto } from './dto/findOne-room.res.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * 룸을 생성할 수 있음 좌표정보, 룸 이름, 반경정보 등이 필요함
   * @param createRoomDto
   * @returns room
   */
  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    return await this.roomRepository.createRoom(createRoomDto);
  }

  /**
   * 좌표와 쿼리 필터정보를 통해서 룸을 찾음. 내가 즐겨찾기했는지, 들어가있는 방인지에대한 판단도 필요
   * @param createRoomDto
   * @returns room
   */
  async findRoom(
    findRoomDto: FindRoomDto,
    userId: UserIdDto,
  ): Promise<ResFindRoomDto[] | []> {
    //
    const isCATEGORY_TYPE = Object.values<string>(CATEGORY_TYPE).includes(
      findRoomDto.filter,
    );
    const user = await this.userRepository.findOneByUserId(userId.userId);
    let rooms = [];
    if (isCATEGORY_TYPE) {
      // 카테고리 타입인 경우
      rooms = await this.roomRepository.findRoomsByCoordinatesWithFilter(
        findRoomDto,
      );
    } else if (findRoomDto.filter === FIND_ROOM_FILTER_TYPE.ALL) {
      //전체 찾기 인경우
      rooms = await this.roomRepository.findRoomsByCoordinates(findRoomDto);
    } else if (findRoomDto.filter === FIND_ROOM_FILTER_TYPE.FAVORITE) {
      // 내가 즐겨 찾기 한경우
      rooms = await this.userRepository.findMyFavoriteRooms(userId);
    }

    //필터링 룸
    const filteredRooms = rooms.map((room: Room) => {
      const iFavorite = user.favoriteRoomList.includes(room._id);
      const iJoin = room._id.equals(user.myRoom);
      return new ResFindRoomDto(room, iFavorite, iJoin);
    });
    return filteredRooms;
  }

  /**
   * 유저를 룸에다가 조인 ( 들어가게 만듬 이때 알림초기상태도 true로 설정)
   * 조인하면서 룸 정보도 뿌려야함.
   * @param roomIdDto
   * @param userIdDto
   * @returns
   */
  async addUserToRoom(
    roomIdDto: RoomIdDto,
    userIdDto: UserIdDto,
  ): Promise<Room> {
    // 이전 룸에서 빼주는 로직 추가해야함
    const user = await this.userRepository.findOneByUserId(userIdDto.userId);
    // 유저가현재 들어가있는 방이있으면
    // safe 어프로치 populate 안때려도 가상으로 데려감 몽고디비 Document 형식이면
    // console.log(typeof roomIdDto.roomId, roomIdDto.roomId, user.myRoom._id);

    console.log(roomIdDto.roomId.equals(user.myRoom._id));
    if (user.myRoom) {
      if (roomIdDto.roomId.equals(user.myRoom._id)) {
        // 룸이 같을경우
        throw new BadRequestException('같은 룸 입장 시도');
      }
      // 다른 룸일 경우
      await this.roomRepository.pullUserFromRoom(user.myRoom._id, userIdDto);
    }
    await this.userRepository.setMyRoom(userIdDto, roomIdDto);
    return await this.roomRepository.addUserToRoom(roomIdDto, userIdDto);
  }
  private async setUserMyRoomToNull(userIdDto: UserIdDto) {
    await this.userRepository.setMyRoom(userIdDto, null);
  }

  async pullUserFromRoom(
    roomIdDto: RoomIdDto,
    userIdDto: UserIdDto,
  ): Promise<Room> {
    this.setUserMyRoomToNull(userIdDto);
    return await this.roomRepository.pullUserFromRoom(roomIdDto, userIdDto);
  }

  async pushRoomToUserFavoriteList(roomIdDto: RoomIdDto, userIdDto: UserIdDto) {
    return this.userRepository.pushRoomToFavoriteList(userIdDto, roomIdDto);
  }
  async pullRoomToUserFavoriteList(roomIdDto: RoomIdDto, userIdDto: UserIdDto) {
    return this.userRepository.pullRoomToFavoriteList(userIdDto, roomIdDto);
  }
  private isObjectIdArray(arg: any): arg is Types.ObjectId[] {
    return true;
  }

  async findOneRoomById(roomIdDto: RoomIdDto, userIdDto: UserIdDto) {
    const user = await this.userRepository.findOneByUserId(userIdDto.userId);
    let isUserFavoritRoom = false;
    if (this.isObjectIdArray(user.favoriteRoomList)) {
      isUserFavoritRoom = user.favoriteRoomList.includes(roomIdDto.roomId);
    }
    const room = await this.roomRepository.findOneByRoomId(roomIdDto);
    console.log(room);
    const send = new ResFindOneRoomDto(room, isUserFavoritRoom);
    console.log(send.userList);
    //<Types.ObjectId[]>
    // const favorite = .includes(roomIdDto.roomId);

    return send;
    // return `This action updates a #${id} room`;
  }
  async getMyRoomInfo(userId: UserIdDto) {
    const roomInfo = await this.userRepository.getMyRoom(userId);
    console.log(roomInfo);
    if (!roomInfo) {
      throw new BadRequestException('MyRoom does not exist');
    }
    return roomInfo;
  }
  async getMyFavorite() {
    return;
  }
  async getPopularRooms() {
    return;
  }
}
