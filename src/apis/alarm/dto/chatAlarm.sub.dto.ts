import { Expose, Transform, Type } from 'class-transformer';
import { ALARM_STORE_TYPE } from 'src/common/consts/enum';
import { Types } from 'mongoose';

// use for message transfor
export class ChatAlarmSubDto {
  // 직렬화
  @Expose()
  roomId: string;

  @Expose()
  chatId: string;

  @Expose()
  nickname: string;

  @Expose() // message 내용
  content: string;

  @Expose()
  sender: string;
}

// nickname
// content : message
// chatId : string
// roomId : string
