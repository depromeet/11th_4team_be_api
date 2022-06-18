import { Types } from 'mongoose';
import { Expose } from 'class-transformer';

// use for message transfor

export const userFcmInfoSelect = {
  _id: 1,
  FCMToken: 1,
  appAlarm: 1,
  chatAlarm: 1,
  iJoin: 1,
};
export class UserFcmInfoDto {
  //   @Transform(({ value }) => new Types.ObjectId(value), { toClassOnly: true })
  _id: Types.ObjectId;

  @Expose()
  FCMToken: string;
  @Expose()
  appAlarm: boolean;

  @Expose()
  chatAlarm: boolean;
  @Expose()
  isJoin: boolean;
}
