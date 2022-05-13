import { Expose } from 'class-transformer';
import { PUSH_ALRAM_TYPE } from 'src/common/consts/enum';

// use for message transfor
export class SendPushAlarmSubDto {
  @Expose()
  roomName?: string;
  @Expose()
  nickname: string;

  @Expose()
  content: string;

  @Expose()
  pushAlarmType: PUSH_ALRAM_TYPE;

  @Expose()
  get Title(): string {
    switch (this.pushAlarmType) {
      case PUSH_ALRAM_TYPE.CHAT:
        return this.roomName + ' 채팅방';
      case PUSH_ALRAM_TYPE.COMMENT:
        return '내 질문에 새로운 댓글이 달렸어요';
      case PUSH_ALRAM_TYPE.LETTER:
        return '쪽지가 도착했어요';
      case PUSH_ALRAM_TYPE.OFFICIAL:
        return '서비스 공식알림';
    }
  }

  @Expose()
  get subTitle(): string {
    return this.nickname + ' : ' + this.content;
  }
}
