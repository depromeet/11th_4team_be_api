import { NicknameDto, UpdateProfileDto } from '../apis/users/dto/user.dto';
import { PhoneNumberDto } from '../apis/users/dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { Model, ObjectId, Types } from 'mongoose';
import { User } from 'src/models/user.model';
import { CertificationMobileDto } from 'src/apis/authentication/dto/send-mobile.dto';
import { RoomIdDto } from 'src/common/dtos/RoomId.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

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

  async existByNickName(nickname: string): Promise<boolean> {
    try {
      const result = await this.userModel.exists({ nickname });
      return result;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async create(phoneNumber: PhoneNumberDto): Promise<any> {
    return await this.userModel.create(phoneNumber);
  }

  async updateProfile(profileData: UpdateProfileDto): Promise<any> {
    return await this.userModel.updateOne(profileData);
  }

  /**
   * 4월 14일 이찬진
   * 유저가 룸을 즐겨찾기 해놓기 위한 쿼리
   * @param _id 유저의 아이디
   * @param roomIdDto 룸 아이디 DTO
   * @returns
   */
  async pushRoomToFavoriteList(
    userIdDto: UserIdDto,
    roomIdDto: RoomIdDto,
  ): Promise<User> {
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

    return user;
  }

  async pullRoomToFavoriteList(
    userIdDto: UserIdDto,
    roomIdDto: RoomIdDto,
  ): Promise<User> {
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

    return user;
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
