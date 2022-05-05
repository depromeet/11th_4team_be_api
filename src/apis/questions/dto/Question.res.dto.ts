import { ApiProperty, PickType } from '@nestjs/swagger';
import { Comment, Question } from 'src/models/question.model';
import { Types } from 'mongoose';
import { Exclude, Expose } from 'class-transformer';
export class QuestionShowDto extends PickType(Question, [
  '_id',
  'user',
  'content',
  'commentList',
  'likes',
  'createdAt',
  'myUserId',
] as const) {
  @ApiProperty({
    description: '좋아요 갯수',
    type: Number,
  })
  @Expose()
  get likesCount(): number {
    return this.likes.length;
  }

  @ApiProperty({
    description: '댓글갯수',
    type: Number,
  })
  @Expose()
  get commentsCount(): number {
    return this.commentList.length;
  }

  @ApiProperty({
    description: '내가 좋아요 눌렀는지',
    type: Boolean,
  })
  @Expose({ name: 'ilike' })
  get ilike(): boolean {
    if (
      this.likes.find((user) => {
        return user._id.equals(this.myUserId);
      })
    )
      return true;

    return false;
  }
}
