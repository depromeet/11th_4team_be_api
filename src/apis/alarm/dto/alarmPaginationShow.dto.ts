import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ALARM_STORE_TYPE } from 'src/common/consts/enum';
import { AlarmShowDto } from './alarmShow.dto';

// use for message transfor
export class AlarmPaginationShowDto {
  constructor(noti_list: AlarmShowDto[], isLast: boolean, lastId: string) {
    this.isLast = isLast;
    this.lastId = lastId;
    this.noti_list = noti_list;
  }
  // 직렬화
  @ApiProperty({
    type: [AlarmShowDto],
    description: '알림 리스트',
  })
  @Expose()
  @Type(() => AlarmShowDto)
  noti_list: AlarmShowDto[];

  @ApiProperty({
    type: String,
    description: '마지막인지 여부 ',
  })
  @Expose()
  isLast: boolean;

  @ApiProperty({
    type: String,
    description: '마지막 콘텐트의 아이디',
  })
  @Expose()
  lastId: string;
}
