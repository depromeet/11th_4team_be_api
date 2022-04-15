import { Injectable, Type } from '@nestjs/common';
import { ObjectId, Types } from 'mongoose';
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
  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    return await this.roomRepository.createRoom(createRoomDto);
  }

  async findRoom(findRoomDto: FindRoomDto): Promise<ResFindRoomDto[] | []> {
    const rooms = await this.roomRepository.findRoomsByCoordinatesWithFilter(
      findRoomDto,
    );
    const filteredRooms = rooms.map((room: Room) => new ResFindRoomDto(room));
    return filteredRooms;
  }

  async addUserToRoom(
    roomIdDto: RoomIdDto,
    userIdDto: UserIdDto,
  ): Promise<Room> {
    return await this.roomRepository.addUserToRoom(roomIdDto, userIdDto);
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
}
