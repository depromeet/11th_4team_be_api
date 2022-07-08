import { BadRequestException, Injectable } from '@nestjs/common';
import { AlarmRepository } from 'src/repositories/alarm.repository';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  ALARM_STORE_TYPE,
  PUSH_ALARM,
  PUSH_ALARM_TYPE,
  SAVE_ALARM,
} from 'src/common/consts/enum';
import { Letter } from 'src/models/letter.model';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { User } from 'src/models/user.model';
import { SendPushAlarmPubDto } from './dto/sendPushAlarm.pub.dto';
import { SaveAlarmDto } from './dto/saveAlarm.dto';
import { Comment } from 'src/models/question.model';
import { Room } from 'src/models/room.model';
import { AlarmIdDto } from 'src/common/dtos/AlarmId.dto';
import { AlarmShowDto } from './dto/alarmShow.dto';
import { plainToInstance } from 'class-transformer';
import { QuestionIdDto } from 'src/common/dtos/QuestionId.dto';
import { PageLastIdDto } from 'src/common/dtos/PageLastIdDto';
import { AlarmPaginationShowDto } from './dto/alarmPaginationShow.dto';
import { FcmService } from 'src/fcm/fcm.service';
import { LetterRoomIdDto } from 'src/common/dtos/LetterRoomId.dto';
import { Alarm } from 'src/models/alarm.model';
import { ChatAlarmSubDto } from './dto/chatAlarm.sub.dto';
@Injectable()
export class AlarmService {
  constructor(
    private readonly alarmRepository: AlarmRepository,
    @InjectQueue(PUSH_ALARM) private readonly pushAlarmQueue: Queue,
    @InjectQueue(SAVE_ALARM) private readonly saveAlarmQueue: Queue,
  ) {}

  // enum PUSH_ALARM_TYPE {
  //   COMMENT = 'comment',
  //   LETTER = 'letter',
  //   CHAT = 'chat',
  //   OFFICIAL = 'official',
  // }

  // enum ALARM_TYPE {
  //   COMMENT = 'comment',
  //   LETTER = 'letter',
  //   CHAT = 'chat',
  //   OFFICIAL = 'official',
  //   LIGHTNING = 'lightning',
  //   LIGHTNING_LEVELUP = 'lightningLevelUp',
  // }

  // enum ALARM_STORE_TYPE {
  //   // 댓글 줬을때
  //   COMMENT = 'comment',
  //   // 번개 줬을 떄
  //   LIGHTNING = 'lightning',
  //   // 시스템 전부 공지알림
  //   OFFICIAL = 'official',
  // }

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

  // 나한테 편지가 왔을 때
  // 푸시알림만 해야함
  async pushLetterAlarm(
    sender: User,
    receiver: UserIdDto,
    letter: Letter,
    letterRoomIdDto: LetterRoomIdDto,
  ) {
    const sendPushAlarmObj: SendPushAlarmPubDto = {
      nickname: sender.nickname,
      content: letter.message,
      pushAlarmType: PUSH_ALARM_TYPE.LETTER,
      receivers: [receiver.userId],
      letterRoomId: letterRoomIdDto.letterRoomId.toString(),
    };
    // const redis = await this.pushAlarmQueue.isReady();
    // console.log('check', redis);
    await this.pushAlarmQueue.add(PUSH_ALARM_TYPE.LETTER, sendPushAlarmObj);

    // await this.pushAlarmQueue.add(PUSH_ALARM_TYPE.CHAT, sendPushAlarmObj);
  }

  // 다른사람이 나한테 번개를 줬을 때
  async storeLightningAlarm(sender: User, receiver: UserIdDto) {
    console.log('check', sender);
    const saveAlarmDto: SaveAlarmDto = {
      nickname: sender.nickname,
      user: receiver.userId.toString(),
      alarmType: ALARM_STORE_TYPE.LIGHTNING,
    };

    const sendPushAlarmObj: SendPushAlarmPubDto = {
      nickname: sender.nickname,
      pushAlarmType: PUSH_ALARM_TYPE.LIGHTNING,
      receivers: [receiver.userId],
    };
    await this.saveAlarmQueue.add(ALARM_STORE_TYPE.LIGHTNING, saveAlarmDto);
    await this.pushAlarmQueue.add(PUSH_ALARM_TYPE.LIGHTNING, sendPushAlarmObj);
  }
  // 내 레벨이 올랐을 때 (기획 기달려야함)

  async handleLevelUpAlarm(receiver: UserIdDto, level: string) {
    // const saveAlarmDto: SaveAlarmDto = {
    //   user: receiver.userId.toString(),
    //   content: level,
    //   alarmType: ALARM_STORE_TYPE.LIGHTNING_LEVELUP,
    // };
    // await this.saveAlarmQueue.add(
    //   ALARM_STORE_TYPE.LIGHTNING_LEVELUP,
    //   saveAlarmDto,
    // );

    const sendPushAlarmObj: SendPushAlarmPubDto = {
      receivers: [receiver.userId],
      pushAlarmType: PUSH_ALARM_TYPE.LIGHTNING_LEVELUP,
    };
    await this.pushAlarmQueue.add(
      PUSH_ALARM_TYPE.LIGHTNING_LEVELUP,
      sendPushAlarmObj,
    );
  }

  // 내 질문에 댓글 달렸을 때 ( 내 댓글이면 제외 시켜야함. (이또한 책임을 알람 서비스로 넘김 ))
  //TODO : 댓글알림시에는 댓글 알림 id 도 필드에 보내줘야함...
  async handleCommentAlarm(
    sender: User,
    receiver: UserIdDto,
    room: Room,
    comment: string,
    questionIdDto: QuestionIdDto,
  ) {
    // console.log('check', sender);
    if (sender._id.equals(receiver.userId)) {
      return;
    }
    const saveAlarmDto: SaveAlarmDto = {
      nickname: sender.nickname,
      user: receiver.userId.toString(),
      content: comment,
      roomName: room.name,
      roomId: room._id.toString(),
      alarmType: ALARM_STORE_TYPE.COMMENT,
      questionId: questionIdDto.questionId.toString(),
    };
    // console.log(saveAlarmDto);
    await this.saveAlarmQueue.add(ALARM_STORE_TYPE.COMMENT, saveAlarmDto);

    const sendPushAlarmObj: SendPushAlarmPubDto = {
      nickname: sender.nickname,
      content: comment,
      receivers: [receiver.userId],
      roomId: room._id.toString(),
      pushAlarmType: PUSH_ALARM_TYPE.COMMENT,
      questionId: questionIdDto.questionId.toString(),
    };
    await this.pushAlarmQueue.add(PUSH_ALARM_TYPE.COMMENT, sendPushAlarmObj);
  }

  // 서비스 공식알림 ( 추후 추가 )

  // 알림 읽었을 때
  async watchAlarm(userIdDto: UserIdDto, alarmIdDto: AlarmIdDto) {
    const alarm = await this.alarmRepository.watchOneAlarm(
      userIdDto,
      alarmIdDto,
    );
    if (!alarm) {
      throw new BadRequestException('권한 없음');
    }
  }

  // 알림전체읽음
  async watchAllAlarm(userIdDto: UserIdDto) {
    await this.alarmRepository.watchAllAlarm(userIdDto);
  }

  async getMyAlarms(
    userIdDto: UserIdDto,
    pageLastIdDto: PageLastIdDto,
  ): Promise<AlarmPaginationShowDto> {
    console.log(userIdDto);
    let alarmRawList: Alarm[] = [];
    if (!pageLastIdDto.lastId) {
      alarmRawList = await this.alarmRepository.findAlarmByUserIdFirst(
        userIdDto,
        50,
      );
    } else {
      alarmRawList = await this.alarmRepository.findAlarmByUserIdAndLastId(
        userIdDto,
        pageLastIdDto,
        50,
      );
    }

    const alarmList = plainToInstance(AlarmShowDto, alarmRawList, {
      excludeExtraneousValues: true,
    });
    const isLast = alarmList.length === 50 ? false : true;
    let lastId;
    if (alarmList.length === 50) {
      lastId = alarmList[49]._id.toString();
    } else {
      lastId = null;
    }

    return new AlarmPaginationShowDto(alarmList, isLast, lastId);
  }

  async testChatAlarm() {
    const sendPushAlarmObj: ChatAlarmSubDto = {
      nickname: '테스트 찬진',
      roomId: '626d0c3f3cb6e9dce6cb9ad6',
      chatId: '626d0c3f3cb6e9dce6cb9ad6',
      sender: '62663d718fc11f0eeb47dba3',
      content: 'asdfasdfadsf',
    };

    await this.pushAlarmQueue.add(PUSH_ALARM_TYPE.CHAT, sendPushAlarmObj);
  }
  // 안읽은 알림 갯수

  ///--------------------------------------------- 푸시알림

  // 쪽지가 다른사람 한테 왔을 때

  // 질문에 댓글이 달린경우   --> 푸시알림을 클릭했을 때  ( 프론트에서 처리 가능한가 ? 알림 읽었을 때)

  // 참여중인 채팅방의 채팅알람

  // 서비스 공식알림
}
