import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';
import { MongoIdValidationTransfrom } from '../decorators/MongoIdValidationTransfrom.decorator';
/**
 * mongoId 용 DTO
 */
export class QuestionIdDto {
  constructor(questionId: string) {
    this.questionId = new Types.ObjectId(questionId);
  }

  @ApiProperty({
    type: String,
    title: '질문 아이디',
    description: '몽고아이디 형식입니다 . 질문의 아이디를 받아옵니다.',
    example: '624c24cae25c551b68a6645c',
  })
  @MongoIdValidationTransfrom({ toClassOnly: true })
  questionId: Types.ObjectId;
}
