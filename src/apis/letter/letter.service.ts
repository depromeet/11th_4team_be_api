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
import { ResLetterDto } from './dto/Letter.res.dto';
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
    return new ResLetterDto(
      newLetter,
      new UserIdDto(twoUserList.sender.toString()),
    );
  }

  async getLettersByRoomId(
    letterRoomIdDto: LetterRoomIdDto,
    myUserId: UserIdDto,
  ): Promise<ResLetterDto[]> {
    await this.checkRoomJoin(myUserId, letterRoomIdDto);
    // find by room and, in visibleUser my userId and update notWatchUser to pull my user id
    const myLetters = await this.letterRepository.getMyLettersByRoomId(
      letterRoomIdDto,
      myUserId,
    );
    await this.letterRepository.updateLetterspullUserFromNotWatchUser(
      letterRoomIdDto,
      myUserId,
    );
    const filterMyLetters = myLetters.map(
      (letter) => new ResLetterDto(letter, myUserId),
    );
    return filterMyLetters;
  }

  async getRoomsByMyUserId(myUserId: UserIdDto): Promise<LetterRoomDto[]> {
    const myLetterRooms = await this.letterRepository.getRoomsByMyUserId(
      myUserId,
    );
    console.log(myLetterRooms);

    const filteredMyLetterRooms = myLetterRooms.map(
      (myLetterRoom) => new LetterRoomDto(myLetterRoom, myUserId),
    );
    return filteredMyLetterRooms;
  }

  async leaveLetterRoomByRoomId(
    letterRoomIdDto: LetterRoomIdDto,
    myUserId: UserIdDto,
  ): Promise<LetterRoomDto[]> {
    await this.checkRoomJoin(myUserId, letterRoomIdDto);

    await this.letterRepository.updateLetterspullUserFromVisibleUser(
      letterRoomIdDto,
      myUserId,
    );
    const leavedRoomInfo = await this.letterRepository.leaveRoomByRoomId(
      letterRoomIdDto,
      myUserId,
    );
    if (leavedRoomInfo.leftUserList.length === 2) {
      // 길이가 2가되면 두명다 나간거므로 삭제 진행
      await this.deleteRoomAndLetters(letterRoomIdDto);
    }
    return this.getRoomsByMyUserId(myUserId);
  }

  private async deleteRoomAndLetters(letterRoomIdDto: LetterRoomIdDto) {
    await this.letterRepository.deleteRoom(letterRoomIdDto);
    await this.letterRepository.deleteLetters(letterRoomIdDto);
  }

  private async upsertUserListToLetterRoom(
    twoUserList: TwoUserListDto,
  ): Promise<LetterRoom> {
    // use $all operator

    return await this.letterRepository.upsertUserListToLetterRoom(twoUserList);
  }

  private async checkRoomJoin(
    myUserId: UserIdDto,
    letterRoomIdDto: LetterRoomIdDto,
  ): Promise<boolean> {
    const roomInfo = await this.letterRepository.getRoomByRoomId(
      letterRoomIdDto,
    );
    if (!roomInfo) {
      throw new BadRequestException('쪽지방이 존재하지 않습니다.');
    }
    if (!roomInfo.joinUserList.find((user) => myUserId.userId.equals(user._id)))
      throw new BadRequestException('들어가지 않은 쪽지방 입니다.');
    if (roomInfo.leftUserList.find((user) => myUserId.userId.equals(user._id)))
      throw new BadRequestException('이미 나간 쪽지방 입니다.');
    return true;
  }
}
