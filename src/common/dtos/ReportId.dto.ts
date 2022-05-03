import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';
/**
 * mongoId 용 DTO
 */
export class ReportIdDto {
  constructor(reportId: string | Types.ObjectId) {
    this.reportId = new Types.ObjectId(reportId);
  }

  @ApiProperty({
    type: String,
    title: '유저 아이디',
    description: '몽고아이디 형식입니다. (백엔드 개발자 닉네임 예시)',
    example: '624c24cae25c551b68a6645c',
  })
  @IsNotEmpty()
  @IsObjectId({ message: '유저 아이디가 몽고아이디 형식이 아닙니다.' })
  @Transform(({ value }) => new Types.ObjectId(value))
  reportId: Types.ObjectId;
}
