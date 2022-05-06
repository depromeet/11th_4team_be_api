import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { Forbidden } from 'src/models/forbidden.model';

@Injectable()
export class ForbiddenRepository {
  constructor(
    @InjectModel(Forbidden.name)
    private readonly forbiddenModel: Model<Forbidden>,
  ) {}

  async createForbidden(userIdDto: UserIdDto): Promise<Forbidden> {
    const report = new this.forbiddenModel({
      user: userIdDto.userId,
    });
    return await report.save();
  }

  async findOneForbiddenByUserId(
    userIdDto: UserIdDto,
  ): Promise<Forbidden | null> {
    return await this.forbiddenModel.findOne({ user: userIdDto.userId });
  }
}
