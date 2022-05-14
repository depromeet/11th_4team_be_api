import { Expose, Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ALARM_STORE_TYPE } from 'src/common/consts/enum';

// use for message transfor
export class SaveAlarmDto {
  // 직렬화
  @Expose()
  roomName?: string;
  @Expose()
  nickname: string;

  @Expose()
  @Transform(({ value }) => new Types.ObjectId(value), { toClassOnly: true })
  user: string;

  @Expose()
  content?: string;

  //need to be updated 딥링크 양식 정의 필요 ( 클라와 함께)
  @Expose()
  deepLink: string;

  @Expose()
  alarmType: ALARM_STORE_TYPE;
}
