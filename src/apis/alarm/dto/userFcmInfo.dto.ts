import { Expose } from 'class-transformer';

// use for message transfor

export const userFcmInfoSelect = { FCMToken: 1, appAlarm: 1, chatAlarm: 1 };
export class UserFcmInfoDto {
  @Expose()
  FCMToken: string;
  @Expose()
  appAlarm: boolean;

  @Expose()
  chatAlarm: boolean;
}
