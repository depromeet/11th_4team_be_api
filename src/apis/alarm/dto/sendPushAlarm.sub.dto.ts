import { Expose, Transform } from 'class-transformer';
import { PUSH_ALARM_TYPE } from 'src/common/consts/enum';
import { Types } from 'mongoose';

// use for message transfor
export class SendPushAlarmSubDto {
  @Expose()
  roomName?: string;
  @Expose()
  nickname: string;

  @Expose()
  content: string;

  @Expose()
  pushAlarmType: PUSH_ALARM_TYPE;

  @Expose()
  // @Transform((value) => value.obj.receivers, { toClassOnly: true })
  @Transform(
    (value) => value.obj.receivers.map((e: string) => new Types.ObjectId(e)),
    {
      toClassOnly: true,
    },
  )
  receivers: Types.ObjectId[];

  //need to be updated 딥링크 양식 정의 필요 ( 클라와 함께)
  @Expose()
  deepLink: string;

  @Expose()
  get title(): string {
    switch (this.pushAlarmType) {
      case PUSH_ALARM_TYPE.CHAT:
        return this.roomName + ' 채팅방';
      case PUSH_ALARM_TYPE.COMMENT:
        return '내 질문에 새로운 댓글이 달렸어요';
      case PUSH_ALARM_TYPE.LETTER:
        return '쪽지가 도착했어요';
    }
  }

  @Expose()
  get subTitle(): string {
    return this.nickname + ' : ' + this.content;
  }
}
