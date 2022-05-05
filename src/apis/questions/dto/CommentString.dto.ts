import { PickType } from '@nestjs/swagger';
import { Comment } from 'src/models/question.model';

export class CommentStringDto extends PickType(Comment, ['comment'] as const) {}
