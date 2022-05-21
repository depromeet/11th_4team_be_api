import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';
/**
 * mongoId 용 DTO
 */
export class ReportIdDto {
  constructor(reportId: string | Types.ObjectId) {
    if (reportId instanceof Types.ObjectId) {
      this.reportId = reportId;
    } else {
      this.reportId = new Types.ObjectId(reportId);
    }
  }

  @ApiProperty({
    type: String,
    title: '유저 아이디',
    description: '몽고아이디 형식입니다. (백엔드 개발자 닉네임 예시)',
    example: '626cf238b51596721c21289b',
  })
  @IsNotEmpty()
  @IsMongoId({ message: '유저 아이디가 몽고아이디 형식이 아닙니다.' })
  @Transform(({ value }) => new Types.ObjectId(value), { toClassOnly: true })
  reportId: Types.ObjectId;
}
