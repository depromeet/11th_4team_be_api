import { Expose, Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { ALARM_STORE_TYPE } from 'src/common/consts/enum';

// use for message transfor
export class SaveAlarmSubDto {
  // 직렬화
  @Expose()
  roomName?: string;
  @Expose()
  nickname: string;

  @Expose()
  user: Types.ObjectId;

  @Expose()
  content?: string;

  //need to be updated 딥링크 양식 정의 필요 ( 클라와 함께)
  @Expose()
  deepLink: string;

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

  @Expose()
  alarmType: ALARM_STORE_TYPE;
}
