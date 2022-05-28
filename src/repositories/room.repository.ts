import { InjectModel } from '@nestjs/mongoose';
import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Room } from 'src/models/room.model';
import { CreateRoomDto } from 'src/apis/rooms/dto/create-room.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { RoomIdDto } from 'src/common/dtos/RoomId.dto';
import { CoordinatesDto } from 'src/apis/rooms/dto/coordinates.dto';
import { FindRoomDto } from 'src/apis/rooms/dto/find-room.dto';
import { UserProfileSelect } from 'src/common/dtos/UserProfile.dto';
import {
  UserFcmInfoDto,
  userFcmInfoSelect,
} from 'src/apis/alarm/dto/userFcmInfo.dto';

@Injectable()
export class RoomRepository {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
  ) {}

  async isRoomExist(roomIdDto: RoomIdDto): Promise<any> {
    return this.roomModel.exists({ _id: roomIdDto.roomId });
  }

  /**
   * 룸을 생성하는 함수
   * @param createRoomDto
   * @returns Room
   */
  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    const room = new this.roomModel({
      ...createRoomDto,
      geometry: {
        type: 'Point',
        coordinates: [createRoomDto.lng, createRoomDto.lat],
      },
    });
    return await room.save();
  }

  async findRoomsByCoordinates(findRoomDto: FindRoomDto): Promise<Room[] | []> {
    const room = await this.roomModel.aggregate([
      {
        $geoNear: {
          spherical: true,
          near: {
            type: 'Point',
            coordinates: [Number(findRoomDto.lng), Number(findRoomDto.lat)],
          },
          maxDistance: findRoomDto.radius,
          distanceField: 'distance',
          key: 'geometry',
        },
      },
      {
        $project: {
          _id: 1,
          category: 1,
          name: 1,
          userCount: { $size: '$userList' },
          radius: 1,
          distance: 1,
          geometry: 1,
        },
      },
      // 몽고디비 디폴트 100개임 최대 100개를 뽑아올수있는데 여기서 조정을 해야함
      //   { $limit: 1 },
    ]);
    console.log(room);
    return room;
  }

  async findRoomsByCoordinatesWithFilter(
    findRoomDto: FindRoomDto,
  ): Promise<Room[] | []> {
    const room = await this.roomModel.aggregate([
      {
        $geoNear: {
          spherical: true,
          near: {
            type: 'Point',
            coordinates: [Number(findRoomDto.lng), Number(findRoomDto.lat)],
          },

          maxDistance: findRoomDto.radius,
          // 거리 자동계산해서 distance 필드로 리턴
          distanceField: 'distance',
          key: 'geometry',
        },
      },
      {
        $match: {
          category: findRoomDto.filter,
        },
      },
      {
        $project: {
          _id: 1,
          category: 1,
          name: 1,
          userCount: { $size: '$userList' },
          radius: 1,
          distance: 1,
          geometry: 1,
        },
      },
      // 몽고디비 디폴트 100개임 최대 100개를 뽑아올수있는데 여기서 조정을 해야함
      //   { $limit: 1 },
    ]);
    console.log(room);
    return room;
  }

  async findFavoirteRoomsByCoordinates(
    findRoomDto: FindRoomDto,
    listOfMyFavorite: Room[],
  ): Promise<Room[] | []> {
    const room = await this.roomModel.aggregate([
      {
        $geoNear: {
          spherical: true,
          near: {
            type: 'Point',
            coordinates: [Number(findRoomDto.lng), Number(findRoomDto.lat)],
          },
          maxDistance: findRoomDto.radius,
          // 거리 자동계산해서 distance 필드로 리턴
          distanceField: 'distance',
          key: 'geometry',
        },
      },
      {
        $match: {
          _id: { $in: listOfMyFavorite },
        },
      },
      {
        $project: {
          _id: 1,
          category: 1,
          name: 1,
          userCount: { $size: '$userList' },
          radius: 1,
          distance: 1,
          geometry: 1,
        },
      },
      // 몽고디비 디폴트 100개임 최대 100개를 뽑아올수있는데 여기서 조정을 해야함
      //   { $limit: 1 },
    ]);
    console.log(room);
    return room;
  }
  async addUserToRoom(
    roomIdDto: RoomIdDto,
    userIdDto: UserIdDto,
  ): Promise<Room> {
    console.log('repo', JSON.stringify(roomIdDto));
    const room = await this.roomModel
      .findOneAndUpdate(
        {
          _id: roomIdDto.roomId,
        },
        {
          $addToSet: {
            userList: userIdDto.userId,
          },
        },
        { new: true },
      )
      .populate({
        path: 'userList',
        select: UserProfileSelect,
      })
      .lean<Room>({ defaults: true });
    if (!room) {
      throw new BadRequestException('Room does not exist');
    }

    return room;
  }

  async pullUserFromRoom(
    roomIdDto: RoomIdDto,
    userIdDto: UserIdDto,
  ): Promise<Room> {
    console.log(roomIdDto);
    const room = await this.roomModel
      .findOneAndUpdate(
        {
          _id: roomIdDto.roomId,
        },
        {
          $pull: {
            userList: userIdDto.userId,
          },
        },
        { new: true },
      )
      .lean<Room>({ defaults: true });

    if (!room) {
      throw new BadRequestException('Room does not exist');
    }

    return room;
  }

  async findOneByRoomId(roomIdDto: RoomIdDto): Promise<Room> {
    const room = await this.roomModel
      .findOne({
        _id: roomIdDto.roomId,
      })
      .populate({
        path: 'userList',
        select: UserProfileSelect,
      })
      .lean<Room>({ defaults: true });

    if (!room) {
      throw new BadRequestException('Room does not exist');
    }

    return room;
  }

  async getPopularRooms(): Promise<Room[]> {
    console.log('asdfasdfa');
    const rooms = await this.roomModel.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          category: 1,
          userCount: { $size: '$userList' },
        },
      },
      {
        $sort: {
          userCount: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    return rooms;
  }

  async getUserAlarmInfoInRoom(roomIdDto: RoomIdDto): Promise<Room | null> {
    const room = await this.roomModel
      .findOne({
        _id: roomIdDto.roomId,
      })
      .populate({
        path: 'userList',
        select: userFcmInfoSelect,
      })
      .lean<Room>({ defaults: true });

    return room;
  }
}
