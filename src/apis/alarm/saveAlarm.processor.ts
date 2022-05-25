import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ALARM_STORE_TYPE, SAVE_ALARM } from 'src/common/consts/enum';
import { AlarmRepository } from 'src/repositories/alarm.repository';
import { SaveAlarmDto } from './dto/saveAlarm.dto';

@Processor(SAVE_ALARM)
export class SaveAlarmProcessor {
  constructor(private alarmRepository: AlarmRepository) {}
  @OnQueueFailed()
  errorhandler(job: Job, err: Error) {
    console.log(err);
  }
  @Process(ALARM_STORE_TYPE.COMMENT)
  async handleCommentSaveAlarm(job: Job) {
    // job.data

    const saveAlarmDto = plainToInstance(SaveAlarmDto, job.data);
    console.log('asdfasdfasdfasdfasdfasdf', saveAlarmDto);
    // console.log('processor Commentasdfasdfasdfasdf ', job.data);
    await this.alarmRepository.createAlarm(saveAlarmDto);
  }

  @Process(ALARM_STORE_TYPE.LIGHTNING)
  async handleLightningSaveAlarm(job: Job) {
    // job.data
    console.log('processor Lightning ', job.data);

    const saveAlarmDto = plainToInstance(SaveAlarmDto, job.data);
    console.log(saveAlarmDto, instanceToPlain(saveAlarmDto));
    await this.alarmRepository.createAlarm(saveAlarmDto);
  }
}
