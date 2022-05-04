import { ApiProperty } from '@nestjs/swagger';

export class ReportResultDtoResDto {
  constructor(reportSuccess: boolean) {
    this.reportSuccess = reportSuccess;
  }
  @ApiProperty({ type: Boolean, description: '채팅방 이름' })
  reportSuccess: boolean;
}
