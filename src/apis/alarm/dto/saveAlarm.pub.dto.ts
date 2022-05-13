import { PickType } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { ALARM_STORE_TYPE } from 'src/common/consts/enum';
import { SaveAlarmSubDto } from './saveAlarm.sub.dto';

// use for message transfor
export class SaveAlarmPubDto extends PickType(SaveAlarmSubDto, [
  'roomName',
  'nickname',
  'content',
  'alarmType',
] as const) {
  @Expose()
  user: Types.ObjectId;
}
