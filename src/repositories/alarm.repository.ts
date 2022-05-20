import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserIdDto } from 'src/common/dtos/UserId.dto';

import { Alarm } from 'src/models/alarm.model';
import { SaveAlarmDto } from 'src/apis/alarm/dto/saveAlarm.dto';
import { instanceToPlain } from 'class-transformer';
import { AlarmIdDto } from 'src/common/dtos/AlarmId.dto';
import { PageLastIdDto } from 'src/common/dtos/PageLastIdDto';

@Injectable()
export class AlarmRepository {
  constructor(
    @InjectModel(Alarm.name)
    private readonly AlarmModel: Model<Alarm>,
  ) {}

  async createAlarm(saveAlarmDto: SaveAlarmDto): Promise<Alarm> {
    const alarm = new this.AlarmModel(saveAlarmDto);
    return await alarm.save();
  }

  async findAlarmByUserIdFirst(
    userIdDto: UserIdDto,
    limitCount: number,
  ): Promise<Alarm[]> {
    console.log(userIdDto);
    return await this.AlarmModel.find({ user: userIdDto.userId })
      .sort({ createdAt: -1 })
      .limit(limitCount)
      .lean<Alarm[]>();
  }

  async findAlarmByUserIdAndLastId(
    userIdDto: UserIdDto,
    lastIdDto: PageLastIdDto,
    limitCount: number,
  ): Promise<Alarm[]> {
    console.log(userIdDto);
    return await this.AlarmModel.find({
      user: userIdDto.userId,
      _id: { $lt: lastIdDto.lastId },
    })
      .sort({ createdAt: -1 })
      .limit(limitCount)
      .lean<Alarm[]>();
  }

  async watchOneAlarm(
    userIdDto: UserIdDto,
    alarmIdDto: AlarmIdDto,
  ): Promise<Alarm | null> {
    return await this.AlarmModel.findOneAndUpdate(
      { _id: alarmIdDto.alarmId, user: userIdDto.userId },
      { watch: true },
    );
  }

  async watchAllAlarm(userIdDto: UserIdDto) {
    await this.AlarmModel.updateMany(
      { user: userIdDto.userId },
      { watch: true },
    );
  }
}
