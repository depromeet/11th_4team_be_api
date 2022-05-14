import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ALARM_STORE_TYPE } from 'src/common/consts/enum';

// use for message transfor
export class AlarmShowDto {
  // 직렬화

  @Exclude({ toPlainOnly: false })
  @Expose({ toClassOnly: true })
  roomName?: string;

  @Exclude({ toPlainOnly: false })
  @Expose({ toClassOnly: true })
  nickname: string;

  @Exclude({ toPlainOnly: false })
  @Expose({ toClassOnly: true })
  user: string;

  @Exclude({ toPlainOnly: false })
  @Expose({ toClassOnly: true })
  content?: string;

  //need to be updated 딥링크 양식 정의 필요 ( 클라와 함께)

  @ApiProperty({
    type: String,
    description: '딥링크 정보',
  })
  @Expose()
  deepLink: string;

  @ApiProperty({
    type: String,
    description: '굵은글씨',
  })
  @Expose()
  get title(): string {
    switch (this.alarmType) {
      case ALARM_STORE_TYPE.LIGHTNING:
        return this.nickname + '님이 번개를 줬어요 ⚡️';
      case ALARM_STORE_TYPE.COMMENT:
        return this.nickname + `님이 댓글을 남겼어요 "${this.content}"`;
      case ALARM_STORE_TYPE.OFFICIAL:
        return '서비스 공식알림';
    }
  }
  @ApiProperty({
    type: String,
    description: '얇은 글씨',
  })
  @Expose()
  get subTitle(): string {
    switch (this.alarmType) {
      case ALARM_STORE_TYPE.LIGHTNING:
        return this.nickname;
      case ALARM_STORE_TYPE.COMMENT:
        return this.roomName;
      case ALARM_STORE_TYPE.OFFICIAL:
        return '티키타카 비밀 운영자';
    }
  }

  @ApiProperty({
    enum: ALARM_STORE_TYPE,
    description:
      '알람 저장되는 타입 lightning -> 번개 관련, comment -> 댓글 관련 , official -> 공식알림',
  })
  @Expose()
  alarmType: ALARM_STORE_TYPE;
}
