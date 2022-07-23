import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Alarm, AlarmSchema } from 'src/models/alarm.model';
import { AlarmRepository } from 'src/repositories/alarm.repository';
import { UserModule } from '../users/user.module';
import { AlarmService } from './alarm.service';
import { BullModule } from '@nestjs/bull';
import { PushAlarmProcessor } from './pushAlarm.processor';
import { PUSH_ALARM, SAVE_ALARM } from 'src/common/consts/enum';
import { SaveAlarmProcessor } from './saveAlarm.processor';
import { NotiController } from './noti.controller';
import { FcmModule } from 'src/fcm/fcm.module';
import * as path from 'path';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Alarm.name, schema: AlarmSchema }]),
    forwardRef(() => UserModule),
    BullModule.registerQueue(
      {
        name: PUSH_ALARM
      },
      {
        name: SAVE_ALARM
      }
    ),
    FcmModule.forRoot({
      credentialPath: path.join(__dirname, '../../../fcm-admin.json')
    }),
    RoomsModule
  ],
  controllers: [NotiController],
  providers: [
    AlarmService,
    AlarmRepository,
    PushAlarmProcessor,
    SaveAlarmProcessor
  ],
  exports: [AlarmService, AlarmRepository]
})
export class AlarmModule {}
