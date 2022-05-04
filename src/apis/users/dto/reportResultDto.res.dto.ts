import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class ReportResultDtoResDto {
  constructor(reportSuccess: boolean) {
    this.reportSuccess = reportSuccess;
  }
  @ApiProperty({ type: Boolean, description: '신고 성공여부 안받아도되긴함' })
  @Expose()
  reportSuccess: boolean;
}
