import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { Letter } from 'src/models/letter.model';
import { LetterRoom } from 'src/models/letterRoom.model';
import { TwoUserListDto } from 'src/apis/letter/dto/twoUserList.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { LetterRoomIdDto } from 'src/common/dtos/LetterRoomId.dto';
import { MessageStringDto } from 'src/apis/letter/dto/messageString.dto';
import { UserProfileSelect } from 'src/common/dtos/UserProfile.dto';

@Injectable()
export class LetterRepository {
  constructor(
    @InjectModel(Letter.name) private readonly letterModel: Model<Letter>,
    @InjectModel(LetterRoom.name)
    private readonly letterRoomModel: Model<LetterRoom>,
  ) {}

  async getRoomsByMyUserId(userIdDto: UserIdDto): Promise<LetterRoom[]> {
    // 내가 속한 방에서 편지 하나 lookup 한뒤에 리턴
    // match LeftUserList에는 속하면 안됨.
    const myLetterRooms = await this.letterRoomModel
      .find({
        joinUserList: { $elemMatch: { $eq: userIdDto.userId } },
        leftUserList: { $ne: userIdDto.userId },
      })
      .populate({
        path: 'letters',
        options: {
          perDocumentLimit: 1,
          sort: { _id: -1 },
        },

        select: {
          message: 1,
          createdAt: 1,
          notWatchUser: 1,
          sender: 1,
        },
      })
      .populate({
        path: 'joinUserList',
        select: UserProfileSelect,
      })
      .sort({ updatedAt: -1 })
      .lean<LetterRoom[]>();
    return myLetterRooms;
  }

  async getRoomByRoomId(
    letterRoomId: LetterRoomIdDto,
  ): Promise<LetterRoom | null> {
    return await this.letterRoomModel.findOne({
      _id: letterRoomId.letterRoomId,
    });
  }

  async getMyLettersByRoomId(
    letterRoomId: LetterRoomIdDto,
    userIdDto: UserIdDto,
  ): Promise<Letter[]> {
    // 내가 속한 방에서 편지 하나 lookup 한뒤에 리턴
    // match LeftUserList에는 속하면 안됨.

    //룸아이디로 세부정보봤으면 그뒤에 모든 아이디들은 본걸로 쳐야함.
    const letters = await this.letterModel
      .find({
        letterRoom: letterRoomId.letterRoomId,
        visibleUser: { $elemMatch: { $eq: userIdDto.userId } },
      })
      .populate('sender', UserProfileSelect)
      .sort({ createdAt: -1 })
      .lean<Letter[]>();
    return letters;
  }

  async updateLetterspullUserFromNotWatchUser(
    letterRoomId: LetterRoomIdDto,
    userIdDto: UserIdDto,
  ) {
    // 내가 속한 방에서 편지 하나 lookup 한뒤에 리턴
    // match LeftUserList에는 속하면 안됨.

    //룸아이디로 세부정보봤으면 그뒤에 모든 아이디들은 본걸로 쳐야함.
    await this.letterModel.updateMany(
      {
        letterRoom: letterRoomId.letterRoomId,
      },
      {
        $pull: {
          notWatchUser: userIdDto.userId,
        },
      },
    );
    return;
  }

  async updateLetterspullUserFromVisibleUser(
    letterRoomId: LetterRoomIdDto,
    userIdDto: UserIdDto,
  ) {
    // 내가 속한 방에서 편지 하나 lookup 한뒤에 리턴
    // match LeftUserList에는 속하면 안됨.

    //룸아이디로 세부정보봤으면 그뒤에 모든 아이디들은 본걸로 쳐야함.
    await this.letterModel.updateMany(
      {
        letterRoom: letterRoomId.letterRoomId,
      },
      {
        $pull: {
          visibleUser: userIdDto.userId,
        },
      },
    );
    return;
  }

  async leaveRoomByRoomId(letterRoomId: LetterRoomIdDto, userIdDto: UserIdDto) {
    // 내가 속한 방에서 편지 하나 lookup 한뒤에 리턴
    // match LeftUserList에는 속하면 안됨.
    const letterRoom = await this.letterRoomModel.findOneAndUpdate(
      {
        _id: letterRoomId.letterRoomId,
      },
      {
        $addToSet: { leftUserList: userIdDto.userId },
      },
      { new: true },
    );
    console.log(letterRoom);
    return letterRoom;
  }

  async sendLetterToReciever(
    letterRoomIdDto: LetterRoomIdDto,
    twoUserList: TwoUserListDto,
    messageStringDto: MessageStringDto,
  ) {
    // 내가 속한 방에서 편지 하나 lookup 한뒤에 리턴
    // match LeftUserList에는 속하면 안됨.
    const letter = new this.letterModel({
      letterRoom: letterRoomIdDto.letterRoomId,
      sender: twoUserList.sender,
      message: messageStringDto.message,
      visibleUser: twoUserList.userList,
      notWatchUser: twoUserList.recevier,
    });

    const newLetter = await letter.save();
    const returnletter = await newLetter.populate({
      path: 'sender',
      select: UserProfileSelect,
    });

    return returnletter;
  }

  async upsertUserListToLetterRoom(
    twoUserList: TwoUserListDto,
  ): Promise<LetterRoom> {
    const letterRoom = await this.letterRoomModel.findOneAndUpdate(
      {
        joinUserList: {
          $all: [
            { $elemMatch: { $eq: twoUserList.userList[0] } },
            { $elemMatch: { $eq: twoUserList.userList[1] } },
          ],
        },
      },
      {
        $set: {
          joinUserList: twoUserList.userList,
          leftUserList: [],
        },
      },
      { upsert: true, new: true },
    );
    console.log(letterRoom);
    return letterRoom;
  }

  async deleteRoom(letterRoomIdDto: LetterRoomIdDto) {
    await this.letterRoomModel.deleteOne({ _id: letterRoomIdDto.letterRoomId });
  }

  async deleteLetters(letterRoomIdDto: LetterRoomIdDto) {
    await this.letterModel.deleteMany({
      letterRoom: letterRoomIdDto.letterRoomId,
    });
  }
}
