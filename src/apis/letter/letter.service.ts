import { BadRequestException, Injectable, Type } from '@nestjs/common';
import { ObjectId, Types } from 'mongoose';
import { CATEGORY_TYPE, FIND_ROOM_FILTER_TYPE } from 'src/common/consts/enum';
import { MongoId } from 'src/common/dtos/MongoId.dto';
import { RoomIdDto } from 'src/common/dtos/RoomId.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { Room } from 'src/models/room.model';
import { User } from 'src/models/user.model';
import { LetterRepository } from 'src/repositories/letter.repository';
import { RoomRepository } from 'src/repositories/room.repository';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class LetterService {
  constructor(
    private readonly letterRepository: LetterRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async sendLetterToReciever() {
    return;
  }

  async getRoomInLetters() {
    return;
  }

  async getLetterRooms() {
    return;
  }

  async deleteLetterRooms() {
    return;
  }

  private async upsertUserListToLetterRoom() {
    // use $all operator
    return;
  }
}
