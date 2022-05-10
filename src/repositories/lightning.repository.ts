import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { Lightning } from 'src/models/lightning.model';

@Injectable()
export class LightningRepository {
  constructor(
    @InjectModel(Lightning.name)
    private readonly LightningModel: Model<Lightning>,
  ) {}

  async saveLighting(
    senderIdDto: UserIdDto,
    receiveIdDto: UserIdDto,
    expireAtDate: Date,
  ): Promise<Lightning> {
    const lightning = new this.LightningModel({
      sendUser: senderIdDto.userId,
      receiveUser: receiveIdDto.userId,
      expireAt: expireAtDate,
    });
    return await lightning.save();
  }

  async findOneLightningByUserId(
    senderIdDto: UserIdDto,
    receiveIdDto: UserIdDto,
  ): Promise<Lightning | null> {
    return await this.LightningModel.findOne({
      sendUser: senderIdDto.userId,
      receiveUser: receiveIdDto.userId,
    });
  }
}
