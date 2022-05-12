import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { plainToInstance } from 'class-transformer';
import { PUSH_ALARM, ALARM_TYPE } from 'src/common/consts/enum';
import { SendPushAlarmDto } from './dto/sendPushAlarm.dto';

@Processor(PUSH_ALARM)
export class PushAlarmProcessor {
  @Process(ALARM_TYPE.LETTER)
  async handleLetterAlarm(job: Job) {
    // job.data
    console.log('processor Letter ', job.data);

    const sendPushAlarmDto = plainToInstance(SendPushAlarmDto, job.data);
    console.log(sendPushAlarmDto.subTitle, sendPushAlarmDto.Title);
  }
}
