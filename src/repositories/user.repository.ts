import { NicknameDto, UpdateProfileDto } from '../apis/users/dto/user.dto';
import { PhoneNumberDto } from '../apis/users/dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Injectable,
  HttpException,
  BadRequestException,
  UseInterceptors,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/models/user.model';
import { RoomIdDto } from 'src/common/dtos/RoomId.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { Room } from 'src/models/room.model';
import { UpdateProfileReqDto } from 'src/apis/users/dto/updateUserDto.req.dto';
import { UserProfileSelect } from 'src/common/dtos/UserProfile.dto';
import { ResShortCutRoomDto } from 'src/common/dtos/shortCutRoomInfo.res.dto';
import { STATUS_TYPE, USER_LEVEL_TYPE } from 'src/common/consts/enum';
import {
  UserFcmInfoDto,
  userFcmInfoSelect,
} from 'src/apis/alarm/dto/userFcmInfo.dto';
import { Types } from 'mongoose';
import { FCMUpdateDto } from 'src/apis/users/dto/fcmUpdate.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async banUser(userIdDto: UserIdDto) {
    return await this.userModel.findOneAndUpdate(
      { _id: userIdDto.userId },
      { status: STATUS_TYPE.FORBIDDEN },
    );
  }

  async unBanuser(userIdDto: UserIdDto) {
    return await this.userModel.findOneAndUpdate(
      { _id: userIdDto.userId },
      { status: STATUS_TYPE.NORMAL },
    );
  }

  async signOutUser(userIdDto: UserIdDto) {
    return await this.userModel.findOneAndUpdate(
      { _id: userIdDto.userId },
      {
        status: STATUS_TYPE.SIGNOUT,
        phoneNumber: null,
        nickname: '(탈퇴한 사용자)',
        FCMToken: '',
      },
    );
  }

  async findOneByUserId(userIdDto: UserIdDto): Promise<User | null> {
    const user = await this.userModel
      .findOne({ _id: userIdDto.userId })
      .populate({
        path: 'iBlockUsers',
        select: UserProfileSelect,
      })
      .populate({
        path: 'myRoom',
        select: {
          _id: 1,
          name: 1,
          category: 1,
          geometry: 1,
          userCount: { $size: '$userList' },
        },
      })
      .lean<User>({ defaults: true });
    return user;
  }

  async findOneByNickname(nickname: NicknameDto) {
    const user = await this.userModel
      .findOne(nickname)
      .lean<User>({ defaults: true });
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

  async updateProfile(
    userIdDto: UserIdDto,
    updateProfileDto: UpdateProfileReqDto,
  ): Promise<User> {
    return await this.userModel
      .findOneAndUpdate({ _id: userIdDto.userId }, updateProfileDto, {
        new: true,
      })
      .populate({
        path: 'iBlockUsers',
        select: UserProfileSelect,
      })
      .populate({
        path: 'myRoom',
        select: {
          _id: 1,
          name: 1,
          geometry: 1,

          category: 1,
          userCount: { $size: '$userList' },
        },
      })
      .lean<User>({ defaults: true });
  }

  async blockUser(
    myUserIdDto: UserIdDto,
    otherUserIdDto: UserIdDto,
  ): Promise<User> {
    // 상대방은 보여지면 안되는 부분에서 나를 추가
    await this.userModel.findOneAndUpdate(
      { _id: otherUserIdDto.userId },
      {
        $addToSet: {
          blockedUsers: myUserIdDto.userId,
          opBlockedUsers: myUserIdDto.userId,
        },
      },
      { new: true },
    );
    // 내부분은 보여지면 안되는 부분 , 내 차단목록에 추가
    return await this.userModel
      .findOneAndUpdate(
        { _id: myUserIdDto.userId },
        {
          $addToSet: {
            blockedUsers: otherUserIdDto.userId,
            iBlockUsers: otherUserIdDto.userId,
          },
        },
        { new: true },
      )
      .populate({
        path: 'iBlockUsers',
        select: UserProfileSelect,
      })
      .populate({
        path: 'myRoom',
        select: {
          _id: 1,
          name: 1,
          geometry: 1,
          category: 1,
          userCount: { $size: '$userList' },
        },
      })
      .lean<User>({ defaults: true });
  }

  // async oppositeBlockUser(
  //   myUserIdDto: UserIdDto,
  //   otherUserIdDto: UserIdDto,
  // ): Promise<User> {
  //   // 상대방은 보여지면 안되는 부분에서 나를 추가
  //   await this.userModel.findOneAndUpdate(
  //     { _id: myUserIdDto.userId },
  //     {
  //       $addToSet: {
  //         blockedUsers: myUserIdDto.userId,
  //       },
  //     },
  //     { new: true },
  //   );
  //   // 내부분은 보여지면 안되는 부분 , 내 차단목록에 추가
  //   return await this.userModel
  //     .findOneAndUpdate(
  //       { _id: myUserIdDto.userId },
  //       {
  //         $addToSet: {
  //           blockedUsers: otherUserIdDto.userId,
  //           iBlockUsers: otherUserIdDto.userId,
  //         },
  //       },
  //       { new: true },
  //     )
  //     .populate({
  //       path: 'iBlockUsers',
  //       select: UserProfileSelect,
  //     })
  //     .populate({
  //       path: 'myRoom',
  //       select: {
  //         _id: 1,
  //         name: 1,
  //         geometry: 1,
  //         category: 1,
  //         userCount: { $size: '$userList' },
  //       },
  //     })
  //     .lean<User>({ defaults: true });
  // }

  async unBlockUser(
    myUserIdDto: UserIdDto,
    otherUserIdDto: UserIdDto,
  ): Promise<User> {
    await this.userModel.findOneAndUpdate(
      { _id: otherUserIdDto.userId },
      {
        $pull: {
          blockedUsers: myUserIdDto.userId,
          opBlockedUsers: myUserIdDto.userId,
        },
      },
      { new: true },
    );
    return await this.userModel
      .findOneAndUpdate(
        { _id: myUserIdDto.userId },
        {
          $pull: {
            blockedUsers: otherUserIdDto.userId,
            iBlockUsers: otherUserIdDto.userId,
          },
        },
        { new: true },
      )
      .populate({
        path: 'iBlockUsers',
        select: UserProfileSelect,
      })
      .populate({
        path: 'myRoom',
        select: {
          _id: 1,
          name: 1,
          category: 1,
          geometry: 1,
          userCount: { $size: '$userList' },
        },
      })
      .lean<User>({ defaults: true });
  }

  // app 전채의 알람을 끄고 킬 수 있음
  async toggleApptAlarm(userIdDto: UserIdDto): Promise<boolean> {
    const user = (await this.userModel.findOneAndUpdate(
      { _id: userIdDto.userId },
      [{ $set: { appAlarm: { $eq: [false, '$appAlarm'] } } }],
      { new: true },
    )) as User;
    return user.appAlarm;
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

  async findMyFavoriteRooms(
    userIdDto: UserIdDto,
  ): Promise<ResShortCutRoomDto[]> {
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
          geometry: 1,
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

  async getMyRoom(userIdDto: UserIdDto): Promise<ResShortCutRoomDto | null> {
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
          geometry: 1,
          userCount: { $size: '$userList' },
        },
      },
    ]);
    console.log(roomInfo);

    return roomInfo.length ? roomInfo[0] : null;
  }

  async addUserLigthningScore(userIdDto: UserIdDto): Promise<User> {
    return (await this.userModel.findOneAndUpdate(
      { _id: userIdDto.userId },
      { $inc: { lightningScore: 1 } },
      { new: true },
    )) as User;
  }

  async levelUpUser(userIdDto: UserIdDto, userlevel: number): Promise<User> {
    return (await this.userModel.findOneAndUpdate(
      { _id: userIdDto.userId },
      { level: userlevel },
      { new: true },
    )) as User;
  }

  async findUserFcmToken(
    userIdArray: Types.ObjectId[],
  ): Promise<UserFcmInfoDto[]> {
    return await this.userModel
      .find({ _id: { $in: userIdArray } })
      .select(userFcmInfoSelect)
      .lean<UserFcmInfoDto[]>({ defaults: true });
  }

  async updateUserFCMToken(
    myUserIdDto: UserIdDto,
    FCMTokenDto: FCMUpdateDto,
  ): Promise<string> {
    const user = await this.userModel.findOneAndUpdate(
      { _id: myUserIdDto.userId },
      { FCMToken: FCMTokenDto.FCMToken },
      { new: true },
    );
    console.log(user);
    if (!user) {
      throw new InternalServerErrorException('잘못된 접근');
    }
    return user.FCMToken;
  }
}
