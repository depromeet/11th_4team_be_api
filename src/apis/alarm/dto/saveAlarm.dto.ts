import { Expose, Transform, Type } from 'class-transformer';
import { ALARM_STORE_TYPE } from 'src/common/consts/enum';
import { Types } from 'mongoose';

// use for message transfor
export class SaveAlarmDto {
  // 직렬화
  @Expose()
  roomName?: string;
  @Expose()
  nickname?: string;

  @Expose()
  @Transform(({ value }) => new Types.ObjectId(value), { toClassOnly: true })
  user: string;

  @Expose()
  content?: string;

  @Expose()
  questionId?: string;

  @Expose()
  roomId?: string;

  //need to be updated 딥링크 양식 정의 필요 ( 클라와 함께)
  // @Expose()
  // get deepLink(): string {
  //   switch (this.alarmType) {
  //     case ALARM_STORE_TYPE.LIGHTNING:
  //       return this.roomName + ' 채팅방';
  //     case ALARM_STORE_TYPE.COMMENT:
  //       return '내 질문에 새로운 댓글이 달렸어요';
  //     // case ALARM_STORE_TYPE.OFFICIAL:
  //     //   return '쪽지가 도착했어요';
  //   }
  // }

  @Expose()
  alarmType: ALARM_STORE_TYPE;
}
