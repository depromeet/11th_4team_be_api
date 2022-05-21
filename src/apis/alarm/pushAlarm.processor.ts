import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { PUSH_ALARM, PUSH_ALARM_TYPE } from 'src/common/consts/enum';
import { RoomIdDto } from 'src/common/dtos/RoomId.dto';
import { FcmService } from 'src/fcm/fcm.service';
import { FCM_ADMIN } from 'src/fcm/fcmAdminProvider';
import { RoomRepository } from 'src/repositories/room.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { ChatAlarmSubDto } from './dto/chatAlarm.sub.dto';
import { SendPushAlarmPubDto } from './dto/sendPushAlarm.pub.dto';
import { SendPushAlarmSubDto } from './dto/sendPushAlarm.sub.dto';

@Processor(PUSH_ALARM)
export class PushAlarmProcessor {
  constructor(
    private fcmService: FcmService,
    private userRepository: UserRepository,
    private roomRepository: RoomRepository,
  ) {}

  private async sendPushAlarm(sendPushAlarmDto: SendPushAlarmSubDto) {
    const findUserFcmToken = await this.userRepository.findUserFcmToken(
      sendPushAlarmDto.receivers,
    );
    console.log(findUserFcmToken);

    const TokenArray = findUserFcmToken
      .filter((e) => (e.appAlarm && e.FCMToken.length === 0 ? false : true))
      .map((e) => e.FCMToken);
    console.log(TokenArray);
    if (TokenArray.length) {
      const result = await this.fcmService.sendNotification(
        TokenArray,
        sendPushAlarmDto,
      );
      console.log(result);
    }
  }
  @OnQueueFailed()
  errorhandler(job: Job, err: Error) {
    console.log(err);
  }

  @Process(PUSH_ALARM_TYPE.LETTER)
  async handleLetterAlarm(job: Job) {
    // job.data
    console.log('processor Letter ', job.data);

    const sendPushAlarmDto = plainToInstance(SendPushAlarmSubDto, job.data);
    await this.sendPushAlarm(sendPushAlarmDto);
  }

  @Process(PUSH_ALARM_TYPE.COMMENT)
  async handleCommentSaveAlarm(job: Job) {
    // job.data
    console.log('processor  ALARM Comment ', job.data);

    const sendPushAlarmDto = plainToInstance(SendPushAlarmSubDto, job.data);
    await this.sendPushAlarm(sendPushAlarmDto);
  }

  @Process(PUSH_ALARM_TYPE.CHAT)
  async handleChatAlarm(job: Job) {
    // job.data
    console.log('processor  ALARM Comment ', job.data);

    const chatAlarmSubDto = plainToInstance(ChatAlarmSubDto, job.data);
    const roomNameAndUserAlarmInfoArray =
      await this.roomRepository.getUserAlarmInfoInRoom(
        new RoomIdDto(chatAlarmSubDto.roomId),
      );
    const TokenArray = roomNameAndUserAlarmInfoArray.userFcmInfoList
      .filter((e) =>
        e.appAlarm &&
        !e._id.equals(chatAlarmSubDto.sender) &&
        e.FCMToken.length === 0
          ? false
          : true,
      )
      .map((e) => e.FCMToken);

    const sendPushAlarmObj: SendPushAlarmPubDto = {
      nickname: chatAlarmSubDto.nickname,
      content: chatAlarmSubDto.content,
      pushAlarmType: PUSH_ALARM_TYPE.CHAT,
      chatId: chatAlarmSubDto.chatId,
      roomId: chatAlarmSubDto.roomId.toString(),
      roomName: roomNameAndUserAlarmInfoArray.roomName,
    };

    if (TokenArray.length) {
      const result = await this.fcmService.sendNotification(
        TokenArray,
        plainToInstance(SendPushAlarmSubDto, sendPushAlarmObj),
      );
      console.log(result);
    }
  }
}
