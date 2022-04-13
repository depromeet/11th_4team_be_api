import { CommentsCreateDto } from './dto/comments.create.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: '모든 댓글 가져오기' })
  @Get('all')
  async getAllComment() {
    return this.commentService.getAllComment();
  }

  @ApiOperation({ summary: '댓글 쓰기' })
  @Post(':chatId')
  async cerateComments(
    @Param('chatId') _id: string,
    @Body() body: CommentsCreateDto,
  ) {
    return this.commentService.createComment(_id, body);
  }

  @ApiOperation({ summary: '좋아요수 올리기' })
  @Patch(':id')
  async plusLike(@Param('id') id: string) {
    return this.commentService.plusLike(id);
  }
}
