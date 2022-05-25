import { BadRequestException, Injectable, Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ObjectId, Types } from 'mongoose';
import { CATEGORY_TYPE, FIND_ROOM_FILTER_TYPE } from 'src/common/consts/enum';
import { returnValueToDto } from 'src/common/decorators/returnValueToDto.decorator';
import { BlockedUserDto } from 'src/common/dtos/BlockedUserList.dto';
import { MongoId } from 'src/common/dtos/MongoId.dto';
import { RoomIdDto } from 'src/common/dtos/RoomId.dto';
import { ResShortCutRoomDto } from 'src/common/dtos/shortCutRoomInfo.res.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { UserProfileDto } from 'src/common/dtos/UserProfile.dto';
import { Room } from 'src/models/room.model';
import { User } from 'src/models/user.model';
import { RoomRepository } from 'src/repositories/room.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { ResChatAlarmToggleDto } from './dto/chatAlarmToggle.res.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { ResFavoriteToggleDto } from './dto/FavoriteToggle.res.dto';
import { FindRoomDto } from './dto/find-room.dto';
import { ResFindRoomDto } from './dto/find-room.res.dto copy';
import { ResFindOneRoomDto } from './dto/findOne-room.res.dto';
import { LeftRoomResultResDto } from './dto/leftRoomResult.res.dto';
import { MyRoomInfoDto } from './dto/myRoomInfo.res.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly userRepository: UserRepository,
  ) {}

  private filterRemoveBlockedUserFromUserList(
    userList: UserProfileDto[],
    blockedUserDto: BlockedUserDto,
  ) {
    return userList.filter(
      (user) => !blockedUserDto.blockedUsers.find((e) => e.equals(user._id)),
    );
  }

  /**
   * 룸 정보를 가져옴
   */
  @returnValueToDto(Room)
  async findOneByRoomId(roomIdDto: RoomIdDto): Promise<Room> {
    return await this.roomRepository.findOneByRoomId(roomIdDto);
  }

  /**
   * 룸을 생성할 수 있음 좌표정보, 룸 이름, 반경정보 등이 필요함
   * @param createRoomDto
   * @returns room
   */
  @returnValueToDto(Room)
  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    return await this.roomRepository.createRoom(createRoomDto);
  }

  /**
   * 좌표와 쿼리 필터정보를 통해서 룸을 찾음. 내가 즐겨찾기했는지, 들어가있는 방인지에대한 판단도 필요
   * @param createRoomDto
   * @returns room
   */
  // @returnValueToDto(ResFindRoomDto)
  async findRoom(
    findRoomDto: FindRoomDto,
    userId: UserIdDto,
  ): Promise<ResFindRoomDto[] | []> {
    //
    const isCATEGORY_TYPE = Object.values<string>(CATEGORY_TYPE).includes(
      findRoomDto.filter,
    );
    const user = await this.userRepository.findOneByUserId(userId);
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
      rooms = await this.roomRepository.findFavoirteRoomsByCoordinates(
        findRoomDto,
        user.favoriteRoomList,
      );
    }

    const result = rooms.map((element: Room) => {
      const iFavorite = user.favoriteRoomList.find((room) =>
        room._id.equals(element._id),
      )
        ? true
        : false;
      const iJoin = element._id.equals(user.myRoom._id);
      return { ...element, iFavorite, iJoin };
    });
    //필터링 룸
    // const filteredRooms = rooms.map((room: Room) => {
    //   const iFavorite = user.favoriteRoomList.includes(room._id);
    //   const iJoin = room._id.equals(user.myRoom);
    //   return new ResFindRoomDto(room, iFavorite, iJoin);
    // });
    return plainToInstance(ResFindRoomDto, result, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 유저를 룸에다가 조인 ( 들어가게 만듬 이때 알림초기상태도 true로 설정)
   * 조인하면서 룸 정보도 뿌려야함.
   * @param roomIdDto
   * @param userIdDto
   * @returns
   */
  // 차단 로직 적용필요
  async addUserToRoom(
    roomIdDto: RoomIdDto,
    userIdDto: UserIdDto,
    blockUserListDto: BlockedUserDto,
  ): Promise<ResFindOneRoomDto> {
    // 이전 룸에서 빼주는 로직 추가해야함
    const user = await this.userRepository.findOneByUserId(userIdDto);
    // 유저가현재 들어가있는 방이있으면
    // safe 어프로치 populate 안때려도 가상으로 데려감 몽고디비 Document 형식이면
    // console.log(typeof roomIdDto.roomId, roomIdDto.roomId, user.myRoom._id);
    const room = await this.roomRepository.findOneByRoomId(roomIdDto);

    if (user.myRoom) {
      // 유저가 들어간 채팅방이 있을경우
      if (roomIdDto.roomId.equals(user.myRoom._id)) {
        // 룸이 같을경우 룸의 정보를 리턴
        const iFavorite = user.favoriteRoomList.find((room) =>
          room._id.equals(user.myRoom._id),
        )
          ? true
          : false;
        // const isFavoritRoom = user.favoriteRoomList.includes(user.myRoom._id);

        // 차단 유저아웃
        room.userList = this.filterRemoveBlockedUserFromUserList(
          room.userList,
          blockUserListDto,
        );
        const result = { ...room, iFavorite, iAlarm: user.chatAlarm };

        return plainToInstance(ResFindOneRoomDto, result, {
          excludeExtraneousValues: true,
        });
      } else {
        // 다른 룸일 경우 다른룸에서 해당 유저를 빼줌
        // 300명인지 체크하는 로직추가
        if (room.userCount >= 300) {
          throw new BadRequestException('유저수가 300명이 넘었습니다.');
        }

        await this.roomRepository.pullUserFromRoom(
          new RoomIdDto(user.myRoom._id),
          userIdDto,
        );
      }
    }
    // 300명인지 체크하는 로직추가
    if (room.userCount >= 300) {
      throw new BadRequestException('유저수가 300명이 넘었습니다.');
    }
    // 룸에 새로 들어갈때,,,?
    await this.userRepository.setMyRoom(userIdDto, roomIdDto);
    await this.userRepository.turnOnChatAlarm(userIdDto);
    const newRoom = await this.roomRepository.addUserToRoom(
      roomIdDto,
      userIdDto,
    );
    //check
    const iFavorite = user.favoriteRoomList.find((room) =>
      room._id.equals(roomIdDto.roomId),
    )
      ? true
      : false;

    // 차단 유저아웃
    newRoom.userList = this.filterRemoveBlockedUserFromUserList(
      newRoom.userList,
      blockUserListDto,
    );

    const result = { ...newRoom, iFavorite, iAlarm: true };
    // console.log(result);
    return plainToInstance(ResFindOneRoomDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @returnValueToDto(LeftRoomResultResDto)
  async pullUserFromRoom(
    roomIdDto: RoomIdDto,
    userIdDto: UserIdDto,
  ): Promise<LeftRoomResultResDto> {
    await this.userRepository.setMyRoom(userIdDto, null);
    const result = await this.roomRepository.pullUserFromRoom(
      roomIdDto,
      userIdDto,
    );
    return { leftSuccess: result ? true : false };
  }

  // async pushRoomToUserFavoriteList(roomIdDto: RoomIdDto, userIdDto: UserIdDto) {
  //   console.log(await this.roomRepository.isRoomExist(roomIdDto));
  // }
  // async pullRoomToUserFavoriteList(roomIdDto: RoomIdDto, userIdDto: UserIdDto) {
  //   return this.userRepository.pullRoomToFavoriteList(userIdDto, roomIdDto);
  // }

  async toggleRoomToUserFavoriteList(
    roomIdDto: RoomIdDto,
    userIdDto: UserIdDto,
  ): Promise<ResFavoriteToggleDto> {
    const user = await this.userRepository.findOneByUserId(userIdDto);
    const isFavoritRoom = user.favoriteRoomList.find((room) =>
      roomIdDto.roomId.equals(room._id),
    );
    console.log('asdfasdf', isFavoritRoom);
    let iFavoritRoom: boolean;
    if (isFavoritRoom) {
      //내가 이미 즐겨찾기해놨으면
      iFavoritRoom = await this.userRepository.pullRoomToFavoriteList(
        userIdDto,
        roomIdDto,
      );
    } else {
      // 즐겨찾기 안해놨으면
      if (!(await this.roomRepository.isRoomExist(roomIdDto))) {
        throw new BadRequestException('Room does not exist');
      }
      iFavoritRoom = await this.userRepository.pushRoomToFavoriteList(
        userIdDto,
        roomIdDto,
      );
    }
    return plainToInstance(ResFavoriteToggleDto, {
      iFavoritRoom: iFavoritRoom,
    });
  }

  // async findOneRoomById(roomIdDto: RoomIdDto, userIdDto: UserIdDto) {
  //   const user = await this.userRepository.findOneByUserId(userIdDto.userId);
  //   let isUserFavoritRoom = false;
  //   if (!user.myRoom._id.equals(roomIdDto.roomId)) {
  //     throw new BadRequestException('유저가 들어간 방이 아닙니다.');
  //   }
  //   if (this.isObjectIdArray(user.favoriteRoomList)) {
  //     isUserFavoritRoom = user.favoriteRoomList.includes(roomIdDto.roomId);
  //   }
  //   const room = await this.roomRepository.findOneByRoomId(roomIdDto);
  //   const send = new ResFindOneRoomDto(room, isUserFavoritRoom, user.chatAlarm);

  //   return send;
  // }
  @returnValueToDto(MyRoomInfoDto)
  async getMyRoomInfo(userId: UserIdDto) {
    const roomInfo = await this.userRepository.getMyRoom(userId);
    console.log(roomInfo);

    //TODO : 채팅 정보 추가해야함
    // if (!roomInfo) {
    //   throw new BadRequestException('MyRoom does not exist');
    // }
    return roomInfo;
  }
  @returnValueToDto(ResShortCutRoomDto)
  async getMyFavorite(userId: UserIdDto) {
    return await this.userRepository.findMyFavoriteRooms(userId);
  }

  async toggleChatAlarm(userId: UserIdDto): Promise<ResChatAlarmToggleDto> {
    const isChatAlarmOn = await this.userRepository.toggleChatAlarm(userId);

    return plainToInstance(ResChatAlarmToggleDto, {
      isChatAlarmOn: isChatAlarmOn,
    });
  }

  @returnValueToDto(ResShortCutRoomDto)
  async getPopularRooms() {
    console.log('asdfasdfa');
    return await this.roomRepository.getPopularRooms();
  }
}
