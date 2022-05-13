import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ALARM_STORE_TYPE, SAVE_ALARM } from 'src/common/consts/enum';
import { SendPushAlarmSubDto } from './dto/sendPushAlarm.sub.dto';

@Processor(SAVE_ALARM)
export class SaveAlarmProcessor {
  @Process(ALARM_STORE_TYPE.COMMENT)
  async handleCommentSaveAlarm(job: Job) {
    // job.data
    console.log('processor Letter ', job.data);

    const saveAlarmDto = plainToInstance(SendPushAlarmSubDto, job.data);
    console.log(instanceToPlain(saveAlarmDto));
  }
}
