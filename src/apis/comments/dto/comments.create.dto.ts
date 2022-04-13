import { PickType } from '@nestjs/swagger';
import { Comment } from 'src/models/comment.model';
export class CommentsCreateDto extends PickType(Comment, [
  'author',
  'contents',
] as const) {}
