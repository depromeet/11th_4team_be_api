import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ALARM_STORE_TYPE, SAVE_ALARM } from 'src/common/consts/enum';
import { SaveAlarmSubDto } from './dto/saveAlarm.sub.dto';

@Processor(SAVE_ALARM)
export class SaveAlarmProcessor {
  @OnQueueFailed()
  errorhandler(job: Job, err: Error) {
    console.log(err);
  }
  @Process(ALARM_STORE_TYPE.COMMENT)
  async handleCommentSaveAlarm(job: Job) {
    // job.data

    const saveAlarmDto = plainToInstance(SaveAlarmSubDto, job.data);
    console.log(
      'asdfasdfasdfasdfasdfasdf',
      saveAlarmDto,
      instanceToPlain(saveAlarmDto),
    );
    // console.log('processor Commentasdfasdfasdfasdf ', job.data);
  }

  @Process(ALARM_STORE_TYPE.LIGHTNING)
  async handleLightningSaveAlarm(job: Job) {
    // job.data
    console.log('processor Lightning ', job.data);

    const saveAlarmDto = plainToInstance(SaveAlarmSubDto, job.data);
    console.log(saveAlarmDto, instanceToPlain(saveAlarmDto));
  }
}
