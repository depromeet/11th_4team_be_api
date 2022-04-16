import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { Letter } from 'src/models/letter.model';
import { LetterRoom } from 'src/models/letterRoom.model';
import { TwoUserListDto } from 'src/apis/letter/dto/twoUserList.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { LetterRoomIdDto } from 'src/common/dtos/LetterRoomId.dto';

@Injectable()
export class LetterRepository {
  constructor(
    @InjectModel(Letter.name) private readonly letterModel: Model<Letter>,
    @InjectModel(LetterRoom.name)
    private readonly letterRoomModel: Model<LetterRoom>,
  ) {}

  async getAllMyLetters(userId: UserIdDto) {
    // 내가 속한 방에서 편지 하나 lookup 한뒤에 리턴
    // match LeftUserList에는 속하면 안됨.
    return;
  }

  async getMyLetterByRoomId(letterRoomId: LetterRoomIdDto) {
    // 내가 속한 방에서 편지 하나 lookup 한뒤에 리턴
    // match LeftUserList에는 속하면 안됨.
    const letterRoom = await this.letterModel
      .find({
        letterRoom: letterRoomId.letterRoomId,
      })
      .populate('sender', { nickname: 1, profileUrl: 1, _id: 1 });
    return letterRoom;
  }

  async leaveRoomByRoomId(letterRoomId: LetterRoomIdDto, userId: UserIdDto) {
    // 내가 속한 방에서 편지 하나 lookup 한뒤에 리턴
    // match LeftUserList에는 속하면 안됨.
    const letterRoom = await this.letterModel
      .find({
        letterRoom: letterRoomId.letterRoomId,
      })
      .populate('sender', { nickname: 1, profileUrl: 1, _id: 1 });
    return letterRoom;
  }

  async sendLetterToReciever(
    letterRoomId: LetterRoomIdDto,
    sender: UserIdDto,
    message: string,
  ) {
    // 내가 속한 방에서 편지 하나 lookup 한뒤에 리턴
    // match LeftUserList에는 속하면 안됨.
    const letter = new this.letterModel({
      letterRoom: letterRoomId.letterRoomId,
      sender: sender.userId,
      message: message,
    });

    return await letter.save();
  }

  async upsertUserListToLetterRoom(
    twoUserList: TwoUserListDto,
  ): Promise<LetterRoom> {
    const letterRoom = await this.letterRoomModel.findOneAndUpdate(
      {
        joinUserList: { $all: twoUserList.userList },
      },
      { upsert: true },
    );
    return letterRoom;
  }
}
