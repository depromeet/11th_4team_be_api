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

  async findRoom(findRoomDto: FindRoomDto): Promise<Room[] | []> {
    return await this.roomRepository.findRoomsByCoordinates(findRoomDto);
  }

  async addUserToRoom(
    roomIdDto: RoomIdDto,
    userIdDto: UserIdDto,
  ): Promise<Room> {
    return await this.roomRepository.addUserToRoom(roomIdDto, userIdDto);
  }

  async addRoomToUserFavoriteList(roomIdDto: RoomIdDto, userIdDto: UserIdDto) {
    return this.userRepository.addRoomToFavoriteList(userIdDto, roomIdDto);
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

    //<Types.ObjectId[]>
    // const favorite = .includes(roomIdDto.roomId);

    return new ResFindOneRoomDto(room, isUserFavoritRoom);
    // return `This action updates a #${id} room`;
  }
}
