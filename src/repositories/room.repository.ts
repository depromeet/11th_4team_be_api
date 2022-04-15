import { InjectModel } from '@nestjs/mongoose';
import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Room } from 'src/models/room.model';
import { CreateRoomDto } from 'src/apis/rooms/dto/create-room.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { RoomIdDto } from 'src/common/dtos/RoomId.dto';
import { CoordinatesDto } from 'src/apis/rooms/dto/coordinates.dto';
import { FindRoomDto } from 'src/apis/rooms/dto/find-room.dto';

@Injectable()
export class RoomRepository {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
  ) {}

  /**
   * 룸을 생성하는 함수
   * @param createRoomDto
   * @returns Room
   */
  async createRoom(createRoomDto: CreateRoomDto): Promise<Room | null> {
    const room = new this.roomModel({
      ...createRoomDto,
      geometry: {
        type: 'Point',
        coordinates: [createRoomDto.lng, createRoomDto.lat],
      },
    });
    return await room.save();
  }

  async findRoomsByCoordinates(
    coordinatesDto: CoordinatesDto,
  ): Promise<Room[] | []> {
    const room = await this.roomModel.aggregate([
      {
        $geoNear: {
          spherical: true,
          near: {
            type: 'Point',
            coordinates: [
              Number(coordinatesDto.lng),
              Number(coordinatesDto.lat),
            ],
          },
          // TODO : 4월 14일 이찬진
          //지도에서 모든 룸에대한 정보를 리스트로 뿌려야함... 거리제한 조건이 없움...
          // 기획안 변경되면 maxDistance 값을 조정해야함
          maxDistance: 10000000000,
          // 거리 자동계산해서 distance 필드로 리턴
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
          // TODO : 4월 14일 이찬진
          //지도에서 모든 룸에대한 정보를 리스트로 뿌려야함... 거리제한 조건이 없움...
          // 기획안 변경되면 maxDistance 값을 조정해야함
          maxDistance: 10000000000,
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

  // async findMyFavoriteRooms(roomId: RoomIdDto): Promise<Room> {
  //   const room = await this.roomModel.findOne({ _id: roomId.roomId });
  //   con
  //   return room;
  // }

  async addUserToRoom(
    roomIdDto: RoomIdDto,
    userIdDto: UserIdDto,
  ): Promise<Room> {
    const room = await this.roomModel.findOneAndUpdate(
      {
        _id: roomIdDto,
      },
      {
        $addToSet: {
          userList: userIdDto.userId,
        },
      },
      { new: true },
    );
    if (!room) {
      throw new BadRequestException('Room does not exist');
    }

    return room;
  }

  async pullUserFromRoom(
    roomIdDto: RoomIdDto,
    userIdDto: UserIdDto,
  ): Promise<Room> {
    const room = await this.roomModel.findOneAndUpdate(
      {
        _id: roomIdDto,
      },
      {
        $pull: {
          userList: userIdDto.userId,
        },
      },
      { new: true },
    );
    if (!room) {
      throw new BadRequestException('Room does not exist');
    }

    return room;
  }

  async findOneByRoomId(roomIdDto: RoomIdDto): Promise<Room> {
    const room = await this.roomModel
      .findOne({
        _id: roomIdDto,
      })
      .populate('userList', '_id nickname profileUrl');
    if (!room) {
      throw new BadRequestException('Room does not exist');
    }

    return room;
  }

  // const comment = await Comment.findOneAndUpdate(
  //   { content_id: content_id },
  //   {
  //     $addToSet: {
  //       list: {
  //         user: user_id,
  //         commentString: replaceCommentString,
  //         tagUser: tagUserIds,
  //       },
  //     },
  //   },
  //   { upsert: true, new: true }
  // );

  // async findOneByNickname(nickname: NicknameDto) {
  //   const room = await this.roomModel.findOne(nickname);
  //   return room;
  // }

  // async existByNickName(nickname: string): Promise<boolean> {
  //   try {
  //     const result = await this.roomModel.exists({ nickname });
  //     return result;
  //   } catch (error) {
  //     throw new HttpException('db error', 400);
  //   }
  // }

  // async create(phoneNumber: PhoneNumberDto): Promise<any> {
  //   return await this.roomModel.create(phoneNumber);
  // }

  // async updateProfile(profileData: UpdateProfileDto): Promise<any> {
  //   return await this.roomModel.updateOne(profileData);
  // }
}