import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class NewAlarmStateResDto {
  constructor(appAlarm: boolean) {
    this.appAlarm = appAlarm;
  }

  @ApiProperty({ type: Boolean, description: '바꾸고 난뒤의 알림 상태' })
  @Expose()
  appAlarm: boolean;
}
