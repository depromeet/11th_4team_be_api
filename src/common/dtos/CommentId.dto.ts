import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';
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
  @IsNotEmpty()
  @IsObjectId({ message: '질문의 댓글 아이디가 몽고아이디 형식이 아닙니다.' })
  @Transform(({ value }) => new Types.ObjectId(value), { toClassOnly: true })
  commentId: Types.ObjectId;
}
