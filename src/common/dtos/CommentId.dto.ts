import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';
import { MongoIdValidationTransfrom } from '../decorators/MongoIdValidationTransfrom.decorator';
/**
 * mongoId 용 DTO
 */
export class CommentIdDto {
  constructor(commentId: string) {
    this.commentId = new Types.ObjectId(commentId);
  }

  @ApiProperty({
    type: String,
    title: '질문의 댓글 아이디',
    description: '몽고아이디 형식입니다 . 질문의 댓글의 아이디를 받아옵니다.',
    // example: '624c24cae25c551b68a6645c',
  })
  @MongoIdValidationTransfrom({ toClassOnly: true })
  commentId: Types.ObjectId;
}
