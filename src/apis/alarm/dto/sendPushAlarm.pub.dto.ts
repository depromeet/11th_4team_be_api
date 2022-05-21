import { PickType } from '@nestjs/swagger';

import { SendPushAlarmSubDto } from './sendPushAlarm.sub.dto';

// use for message transfor
export class SendPushAlarmPubDto extends PickType(SendPushAlarmSubDto, [
  'roomName',
  'nickname',
  'content',
  'pushAlarmType',
  'receivers',
  'questionId',
  'letterRoomId',
] as const) {}
