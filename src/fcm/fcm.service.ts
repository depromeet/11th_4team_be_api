import { Inject, Injectable, Logger } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import { SendPushAlarmSubDto } from 'src/apis/alarm/dto/sendPushAlarm.sub.dto';
import { FCM_ADMIN } from './fcmAdminProvider';
// firebaseAdmin.app.App;

@Injectable()
export class FcmService {
  constructor(
    @Inject(FCM_ADMIN) private fcmAdmin: firebaseAdmin.app.App,
    private readonly logger: Logger,
  ) {}

  async sendNotification(
    deviceIds: Array<string>,
    sendPushAlarmDto: SendPushAlarmSubDto,
  ) {
    if (deviceIds.length == 0) {
      throw new Error('You provide an empty device ids list!');
    }

    // const options = {
    //   priority: 'high',
    //   timeToLive: 60 * 60 * 24,
    // };

    // const optionsSilent = {
    //   priority: 'high',
    //   timeToLive: 60 * 60 * 24,
    //   content_available: true,
    // };
    console.log(sendPushAlarmDto.deepLink);
    const fcmPushMessage = {
      notification: {
        title: sendPushAlarmDto.title,
        body: sendPushAlarmDto.body,
      },
      data: {
        deepLink: sendPushAlarmDto.deepLink,
      },
      tokens: deviceIds,
      apns: {
        headers: {
          'apns-priority': '5',
        },
        payload: {
          aps: {
            'mutable-content': 1,
            sound: 'default',
          },
        },
      },
    };

    let result = null;
    try {
      result = await this.fcmAdmin.messaging().sendMulticast(fcmPushMessage);
      //   console.log(result);
    } catch (error) {
      this.logger.error(error.message, error.stackTrace, 'nestjs-fcm');
      throw error;
    }
    return result;
  }
}
