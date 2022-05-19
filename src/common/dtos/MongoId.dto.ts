import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';
/**
 * mongoId 용 DTO
 */
export class MongoId {
  @ApiProperty({
    type: String,
    title: '몽고 아이디',
    description: '몽고아이디 형식입니다.',
  })
  @IsMongoId({ message: '몽고아이디 형식이 아닙니다.' })
  // transform 자동으로 해줌 . main.ts 참고
  @Transform(({ value }) => new Types.ObjectId(value))
  _id: Types.ObjectId;
}
