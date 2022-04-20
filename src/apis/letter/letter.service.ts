import { BadRequestException, Injectable, Type } from '@nestjs/common';
import { ObjectId, Types } from 'mongoose';
import { CATEGORY_TYPE, FIND_ROOM_FILTER_TYPE } from 'src/common/consts/enum';
import { LetterRoomIdDto } from 'src/common/dtos/LetterRoomId.dto';
import { MongoId } from 'src/common/dtos/MongoId.dto';
import { RoomIdDto } from 'src/common/dtos/RoomId.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { Letter } from 'src/models/letter.model';
import { LetterRoom } from 'src/models/letterRoom.model';
import { Room } from 'src/models/room.model';
import { User } from 'src/models/user.model';
import { LetterRepository } from 'src/repositories/letter.repository';
import { RoomRepository } from 'src/repositories/room.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { LetterRoomDto } from './dto/LetterRoom.res.dto';
import { MessageStringDto } from './dto/messageString.dto';
import { TwoUserListDto } from './dto/twoUserList.dto';

@Injectable()
export class LetterService {
  constructor(
    private readonly letterRepository: LetterRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async sendLetterToReciever(
    twoUserList: TwoUserListDto,
    messageStringDto: MessageStringDto,
  ) {
    if (twoUserList.userList[0].equals(twoUserList.userList[1])) {
      throw new BadRequestException('유저 아이디가 같음');
    }
    const receiverExist = await this.userRepository.findOneByUserId(
      twoUserList.recevier,
    );
    if (!receiverExist) {
      throw new BadRequestException('수신자가 존재하지 않음');
    }

    const letterRoom = await this.upsertUserListToLetterRoom(twoUserList);
    const newLetter = await this.letterRepository.sendLetterToReciever(
      new LetterRoomIdDto(letterRoom._id),
      twoUserList,
      messageStringDto,
    );
    return newLetter;
  }

  async getLettersByRoomId(
    letterRoomIdDto: LetterRoomIdDto,
    myUserId: UserIdDto,
  ) {
    // find by room and, in visibleUser my userId and update notWatchUser to pull my user id
    return;
  }

  async getRoomsByMyUserId(myUserId: UserIdDto) {
    const myLetterRooms = await this.letterRepository.getRoomsByMyUserId(
      myUserId,
    );
    console.log(myLetterRooms);

    const filteredMyLetterRooms = myLetterRooms.map(
      (myLetterRoom) => new LetterRoomDto(myLetterRoom, myUserId),
    );
    console.log(filteredMyLetterRooms[0].latestTime);
    return filteredMyLetterRooms;
  }

  async leaveLetterRoomByRoomId() {
    return;
  }

  private async upsertUserListToLetterRoom(
    twoUserList: TwoUserListDto,
  ): Promise<LetterRoom> {
    // use $all operator

    return await this.letterRepository.upsertUserListToLetterRoom(twoUserList);
  }
}
