import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { PUSH_ALARM, PUSH_ALARM_TYPE } from 'src/common/consts/enum';
import { FcmService } from 'src/fcm/fcm.service';
import { FCM_ADMIN } from 'src/fcm/fcmAdminProvider';
import { UserRepository } from 'src/repositories/user.repository';
import { SendPushAlarmSubDto } from './dto/sendPushAlarm.sub.dto';

@Processor(PUSH_ALARM)
export class PushAlarmProcessor {
  constructor(
    private fcmService: FcmService,
    private userRepository: UserRepository,
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

    const saveAlarmDto = plainToInstance(SendPushAlarmSubDto, job.data);
    console.log(saveAlarmDto);
  }
}
