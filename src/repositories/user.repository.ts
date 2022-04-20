import { NicknameDto, UpdateProfileDto } from '../apis/users/dto/user.dto';
import { PhoneNumberDto } from '../apis/users/dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { User, Profile } from 'src/models/user.model';
import { RoomIdDto } from 'src/common/dtos/RoomId.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { Room } from 'src/models/room.model';
import { CreateUserDto } from 'src/apis/users/dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const profile = await this.profileModel.create(createUserDto.profile)
    // createUserDto.profile = new Types.ObjectId(profile._id)

    let user = await this.userModel.create({ ...createUserDto })
    // user = await user.populate({ path: 'profile', select: 'type color -_id' })
    user = await user.populate('profile')
    return user
  }

  async findOneByUserId(userId: string | Types.ObjectId): Promise<User | null> {
    const user = await this.userModel.findOne({ _id: userId });
    return user;
  }

  async findOneByPhoneNumber(phoneNumber: PhoneNumberDto) {
    const user = await this.userModel.findOne(phoneNumber);
    return user;
  }

  async findOneByNickname(nickname: NicknameDto) {
    const user = await this.userModel.findOne(nickname);
    return user;
  }

  async existByNickName(nickname: string): Promise<any> {
    try {
      const result = await this.userModel.exists({ nickname });
      return result;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async updateProfile(profileData: UpdateProfileDto): Promise<any> {
    return await this.userModel.updateOne(profileData);
  }

  /**
   * 4월 14일 이찬진
   * 유저가 룸을 즐겨찾기 해놓기 위한 쿼리
   * @param userIdDto 유저의 아이디
   * @param roomIdDto 룸 아이디 DTO
   * @returns
   */
  async pushRoomToFavoriteList(
    userIdDto: UserIdDto,
    roomIdDto: RoomIdDto,
  ): Promise<boolean> {
    const user = await this.userModel.findOneAndUpdate(
      {
        _id: userIdDto.userId,
      },
      {
        $addToSet: {
          favoriteRoomList: roomIdDto.roomId,
        },
      },
      { new: true },
    );
    if (!user) {
      throw new BadRequestException('user does not exist');
    }

    return true;
  }
  /**
   * 4월 14일 이찬진
   * 유저즐겨찾기에서 룸 없애기
   * @param userIdDto 유저의 아이디
   * @param roomIdDto 룸 아이디 DTO
   * @returns
   */
  async pullRoomToFavoriteList(
    userIdDto: UserIdDto,
    roomIdDto: RoomIdDto,
  ): Promise<boolean> {
    const user = await this.userModel.findOneAndUpdate(
      {
        _id: userIdDto.userId,
      },
      {
        $pull: {
          favoriteRoomList: roomIdDto.roomId,
        },
      },
      { new: true },
    );
    if (!user) {
      throw new BadRequestException('user does not exist');
    }

    return false;
  }

  /**
   * 유저의 챗 알림을 켜기
   * @param userIdDto
   * @returns
   */
  async toggleChatAlarm(userIdDto: UserIdDto): Promise<boolean> {
    const user = await this.userModel.findOneAndUpdate(
      { _id: userIdDto.userId },
      [{ $set: { chatAlarm: { $eq: [false, '$chatAlarm'] } } }],
      { new: true },
    );

    if (!user) {
      throw new BadRequestException('user does not exist');
    }

    return user.chatAlarm;
  }
  /**
   * 유저의 챗 알림을 끄기
   * @param userIdDto
   * @returns
   */
  async turnOnChatAlarm(userIdDto: UserIdDto): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      {
        _id: userIdDto.userId,
      },
      {
        $set: {
          chatAlarm: true,
        },
      },
      { new: true },
    );
    if (!user) {
      throw new BadRequestException('user does not exist');
    }

    return user;
  }

  async findMyFavoriteRooms(userIdDto: UserIdDto): Promise<Room[]> {
    const myFavoriteRoomList = await this.userModel.aggregate([
      {
        $match: {
          _id: userIdDto.userId,
        },
      },
      {
        $lookup: {
          from: 'room',
          localField: 'favoriteRoomList',
          foreignField: '_id',
          as: 'favoriteRoomList',
        },
      },
      {
        $unwind: '$favoriteRoomList',
      },
      {
        $replaceRoot: { newRoot: '$favoriteRoomList' },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          category: 1,
          userCount: { $size: '$userList' },
        },
      },
      { $sort: { userCount: -1 } },
    ]);
    // .populate("favoriteRoomList" , {});

    return myFavoriteRoomList;
  }

  async setMyRoom(
    userIdDto: UserIdDto,
    roomId: RoomIdDto | null,
  ): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      {
        _id: userIdDto.userId,
      },
      {
        $set: {
          // 룸에서 나간경우 Null로 설정
          myRoom: roomId ? roomId.roomId : null,
        },
      },
      { new: true },
    );
    if (!user) {
      throw new BadRequestException('user does not exist');
    }

    return user;
  }

  async getMyRoom(userIdDto: UserIdDto) {
    const roomInfo = await this.userModel.aggregate([
      {
        $match: {
          _id: userIdDto.userId,
        },
      },
      {
        $lookup: {
          from: 'room',
          localField: 'myRoom',
          foreignField: '_id',
          as: 'myRoom',
        },
      },
      {
        $unwind: '$myRoom',
      },
      {
        $replaceRoot: { newRoot: '$myRoom' },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          category: 1,
          userCount: { $size: '$userList' },
        },
      },
    ]);
    console.log(roomInfo);

    return roomInfo.length ? roomInfo[0] : null;
  }
}

// /**
//  * 4월 14일 이찬진
//  * 유저가 룸을 즐겨찾기했는지에 대한 여부 조사
//  * @param _id 유저의 아이디
//  * @param roomIdDto 룸 아이디 DTO
//  * @returns
//  */
// async IsUserFavoriteRoom(
//   userIdDto: UserIdDto,
//   roomIdDto: RoomIdDto,
// ): Promise<boolean> {
//   const user = await this.userModel
//     .findOne({
//       _id: userIdDto.userId,
//     })
//     .select('favoriteRoomList');
//   if (!user) {
//     throw new BadRequestException('user does not exist');
//   }

//   return user.favoriteRoomList.includes(roomIdDto.roomId);
// }
