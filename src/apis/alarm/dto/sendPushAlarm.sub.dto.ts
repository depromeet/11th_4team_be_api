import { Expose, Transform } from 'class-transformer';
import { DEEPLINK_BASEURL, PUSH_ALARM_TYPE } from 'src/common/consts/enum';
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
  receivers?: Types.ObjectId[];

  //need to be updated 딥링크 양식 정의 필요 ( 클라와 함께)
  @Expose()
  get deepLink(): string {
    switch (this.pushAlarmType) {
      case PUSH_ALARM_TYPE.CHAT:
        return (
          DEEPLINK_BASEURL +
          'chat-room?chat-room_id=' +
          this.roomId +
          '&message_id=' +
          this.chatId
        );
      case PUSH_ALARM_TYPE.COMMENT:
        return (
          DEEPLINK_BASEURL + 'question-detail?question_id=' + this.questionId
        );
      case PUSH_ALARM_TYPE.LETTER:
        return (
          DEEPLINK_BASEURL + 'letter-room?letter-room_id=' + this.letterRoomId
        );
    }
  }

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
  get body(): string {
    return this.nickname + ' : ' + this.content;
  }

  @Expose()
  questionId?: string;

  @Expose()
  letterRoomId?: string;

  @Expose()
  chatId?: string;

  @Expose()
  roomId?: string;
}
