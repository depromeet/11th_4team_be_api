import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserIdDto } from 'src/common/dtos/UserId.dto';

import { Alarm } from 'src/models/alarm.model';
import { SaveAlarmSubDto } from 'src/apis/alarm/dto/saveAlarm.sub.dto';
import { instanceToPlain } from 'class-transformer';
import { AlarmIdDto } from 'src/common/dtos/AlarmId.dto';

@Injectable()
export class AlarmRepository {
  constructor(
    @InjectModel(Alarm.name)
    private readonly AlarmModel: Model<Alarm>,
  ) {}

  async createAlarm(saveAlarmDto: SaveAlarmSubDto): Promise<Alarm> {
    const alarm = new this.AlarmModel(instanceToPlain(saveAlarmDto));
    return await alarm.save();
  }

  async findAlarmByUserId(userIdDto: UserIdDto): Promise<Alarm[]> {
    return await this.AlarmModel.find({ user: userIdDto.userId });
  }

  async watchOneAlarm(alarmIdDto: AlarmIdDto): Promise<Alarm[]> {
    return await this.AlarmModel.find({ _id: alarmIdDto.alarmId });
  }
}
