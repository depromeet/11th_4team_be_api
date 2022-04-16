import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { Letter } from 'src/models/letter.model';
import { LetterRoom } from 'src/models/letterRoom.model';

@Injectable()
export class LetterRepository {
  constructor(
    @InjectModel(Letter.name) private readonly letterModel: Model<Letter>,
    @InjectModel(LetterRoom.name)
    private readonly letterRoomModel: Model<LetterRoom>,
  ) {}

  // async findOneByUserId(userId: string | Types.ObjectId): Promise<User | null> {
  //   const user = await this.userModel.findOne({ _id: userId });
  //   return user;
  // }
}
