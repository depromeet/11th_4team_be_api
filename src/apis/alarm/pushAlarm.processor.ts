import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { plainToInstance } from 'class-transformer';
import { PUSH_ALARM, PUSH_ALARM_TYPE } from 'src/common/consts/enum';
import { SendPushAlarmSubDto } from './dto/sendPushAlarm.sub.dto';

@Processor(PUSH_ALARM)
export class PushAlarmProcessor {
  @Process(PUSH_ALARM_TYPE.LETTER)
  async handleLetterAlarm(job: Job) {
    // job.data
    console.log('processor Letter ', job.data);

    const sendPushAlarmDto = plainToInstance(SendPushAlarmSubDto, job.data);
    console.log(sendPushAlarmDto.subTitle, sendPushAlarmDto.title);
  }
}
