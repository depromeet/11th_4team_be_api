import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserIdDto } from 'src/common/dtos/UserId.dto';

import { Alarm } from 'src/models/alarm.model';

@Injectable()
export class AlarmRepository {
  constructor(
    @InjectModel(Alarm.name)
    private readonly AlarmModel: Model<Alarm>,
  ) {}

  async createAlarm(userIdDto: UserIdDto): Promise<Alarm> {
    const report = new this.AlarmModel({
      user: userIdDto.userId,
    });
    return await report.save();
  }

  async findOneAlarmByUserId(userIdDto: UserIdDto): Promise<Alarm | null> {
    return await this.AlarmModel.findOne({ user: userIdDto.userId });
  }
}
