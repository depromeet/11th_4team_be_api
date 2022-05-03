import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { Report } from 'src/models/Report.model';
import { ReportIdDto } from 'src/common/dtos/ReportId.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';

@Injectable()
export class ReportRepository {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
  ) {}

  async createReport(
    reporter: UserIdDto,
    reportedUser: UserIdDto,
  ): Promise<Report> {
    const report = new this.reportModel({
      reporter: reporter.userId,
      reportedUser: reportedUser.userId,
    });
    return await report.save();
  }

  async getReports(reportedUser: UserIdDto): Promise<Report[]> {
    return await this.reportModel.find({ reportedUser: reportedUser.userId });
  }

  // 한번 신고하면 신고못하게 확인해야함 , 유저 열명한테 신고받은것을 확인
  async checkMyReportToOther(
    reporter: UserIdDto,
    reportedUser: UserIdDto,
  ): Promise<null | Report> {
    return await this.reportModel.findOne({
      reporter: reporter.userId,
      reportedUser: reportedUser.userId,
    });
  }
}
