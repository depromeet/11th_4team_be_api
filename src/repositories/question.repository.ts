import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { Question } from 'src/models/question.model';

@Injectable()
export class QuestionRepository {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
  ) {}

  //   async getReports(reportedUser: UserIdDto): Promise<Report[]> {
  //     return await this.reportModel.find({ reportedUser: reportedUser.userId });
  //   }
}
