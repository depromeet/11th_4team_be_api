import { Expose, Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { ALARM_STORE_TYPE } from 'src/common/consts/enum';

// use for message transfor
export class SaveAlarmDto {
  // 직렬화
  @Transform((value) => value.obj._id, { toClassOnly: true })
  @Expose()
  user: Types.ObjectId;

  @Transform((value) => value.obj._id, { toClassOnly: true })
  @Expose()
  sender: Types.ObjectId;

  @Expose()
  lawTitle: string;

  @Expose()
  subTitle: string;

  @Expose()
  deepLink: string;

  @Expose()
  alarmType: ALARM_STORE_TYPE;
}
