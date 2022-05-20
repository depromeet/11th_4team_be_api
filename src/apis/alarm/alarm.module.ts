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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Alarm.name, schema: AlarmSchema }]),
    forwardRef(() => UserModule),
    BullModule.registerQueue(
      {
        name: PUSH_ALARM,
      },
      {
        name: SAVE_ALARM,
      },
    ),
  ],
  controllers: [NotiController],
  providers: [
    AlarmService,
    AlarmRepository,
    PushAlarmProcessor,
    SaveAlarmProcessor,
  ],
  exports: [AlarmService, AlarmRepository],
})
export class AlarmModule {}
