import { Injectable } from '@nestjs/common';
import { AlarmRepository } from 'src/repositories/alarm.repository';

@Injectable()
export class AlarmService {
  constructor(private readonly alarmRepository: AlarmRepository) {}

  //pushAlarm  --> fcm push
  // storeAlarm --> user
  // use dto To caller - service
  // use dto To service - repository
  // deepLink handled by this layer
  // 범주는 알림탭  >> 푸시알림 .

  // need info to storeAlarm --> sender , user ( to save ), deepLink , title , subTitle

  // 저장할 정보로 파싱하는건 알림 서비스의 역할
  // 넘겨올댄 콘텐츠를 넘겨옴. 달린 댓글에 대한 정보는 안오니 클릭시 넘어갈 페이지에대한 정보가 필요할둣,....?
  // 센더(알림 이벤트를 만들 발송자)와 콘텐츠 정보면 충분할듯.

  ///--------------------------------------------- 알림탭

  // 내 질문에 댓글 달렸을 때 ( 내 댓글이면 제외 시켜야함. (이또한 책임을 알람 서비스로 넘김 ))
  // async (myUserIdDto: UserIdDto) {
  //     console.log('check');
  //     const user = await this.userRepository.findOneByUserId(myUserIdDto);
  //     console.log(user);
  //     return user.iBlockUsers;
  //   }

  // 다른사람이 나한테 번개를 줬을 때

  // 내 레벨이 올랐을 때

  // 서비스 공식알림

  // 알림 읽었을 때

  // 알림전체읽음

  // 안읽은 알림 갯수

  ///--------------------------------------------- 푸시알림

  // 쪽지가 다른사람 한테 왔을 때

  // 질문에 댓글이 달린경우   --> 푸시알림을 클릭했을 때  ( 프론트에서 처리 가능한가 ? 알림 읽었을 때)

  // 참여중인 채팅방의 채팅알람

  // 서비스 공식알림
}
