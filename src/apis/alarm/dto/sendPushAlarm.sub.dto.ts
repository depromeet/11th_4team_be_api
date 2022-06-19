import { Expose, Transform } from 'class-transformer';
import { DEEPLINK_BASEURL, PUSH_ALARM_TYPE } from 'src/common/consts/enum';
import { Types } from 'mongoose';

// use for message transfor
export class SendPushAlarmSubDto {
  @Expose()
  roomName?: string;
  @Expose()
  nickname?: string;

  @Expose()
  content?: string;

  @Expose()
  pushAlarmType: PUSH_ALARM_TYPE;

  @Expose()
  // @Transform((value) => value.obj.receivers, { toClassOnly: true })
  @Transform(
    (value) =>
      value.obj.receivers &&
      value.obj.receivers.map((e: string) => new Types.ObjectId(e)),
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
          DEEPLINK_BASEURL +
          'question-detail?question_id=' +
          this.questionId +
          '&chat-room_id=' +
          this.roomId
        );
      case PUSH_ALARM_TYPE.LETTER:
        return (
          DEEPLINK_BASEURL + 'letter-room?letter-room_id=' + this.letterRoomId
        );
      case PUSH_ALARM_TYPE.LIGHTNING_LEVELUP:
        return DEEPLINK_BASEURL + 'screen-type?mypage';
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
      case PUSH_ALARM_TYPE.LIGHTNING_LEVELUP:
        return '등급이 업그레이드 되었어요!';
    }
  }

  @Expose()
  get body(): string {
    switch (this.pushAlarmType) {
      case PUSH_ALARM_TYPE.LIGHTNING_LEVELUP:
        return '티키타카에서 새로 받은 아이템을 확인해보세요';
      default:
        return this.nickname + ' : ' + this.content;
    }
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
