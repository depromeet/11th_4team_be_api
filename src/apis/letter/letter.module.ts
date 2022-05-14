import { LetterService } from './letter.service';
import { LetterController } from './letter.controller';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from 'src/models/room.model';

import { User, UserSchema } from 'src/models/user.model';
import { UserModule } from '../users/user.module';
import { LetterRepository } from 'src/repositories/letter.repository';
import { Letter, LetterSchema } from 'src/models/letter.model';
import { LetterRoom, LetterRoomSchema } from 'src/models/letterRoom.model';
import { AlarmModule } from '../alarm/alarm.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: User.name, schema: UserSchema },
      { name: Letter.name, schema: LetterSchema },
      { name: LetterRoom.name, schema: LetterRoomSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => AlarmModule),
  ],
  providers: [LetterService, LetterRepository],
  controllers: [LetterController],
  exports: [LetterService, LetterRepository],
})
export class LetterModule {}
