import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { Alarm } from 'src/models/alarm.model';
import { SaveAlarmDto } from 'src/apis/alarm/dto/saveAlarm.dto';

import { OfficialNoti } from 'src/models/officialNoti';

@Injectable()
export class OfficialNotiRepository {
  constructor(
    @InjectModel(OfficialNoti.name)
    private readonly officialNotiModel: Model<Alarm>,
  ) {}

  async getOfficialNotis(): Promise<OfficialNoti[]> {
    const notis = await this.officialNotiModel
      .find()
      .sort({ _id: -1 })
      .lean<OfficialNoti[]>();
    return notis;
  }
}
