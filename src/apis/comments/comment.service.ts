import { CommentsCreateDto } from './dto/comments.create.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserRepository } from 'src/repositories/user.repository';
import { Comment } from 'src/models/comment.model';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentsModel: Model<Comment>,
    private readonly userRepository: UserRepository,
  ) {}
  async getAllComment() {
    try {
      const comments = await this.commentsModel.find();
      return comments;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createComment(_id: string, commentData: CommentsCreateDto) {
    try {
      const targetUser = await this.userRepository.findOneByUserId(_id);

      const { contents, author } = commentData;
      const validatedAuthor = await this.userRepository.findOneByUserId(author);

      const newComment = new this.commentsModel({
        author: validatedAuthor._id,
        contents,
        info: targetUser._id,
      });
      return await newComment.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async plusLike(id: string) {
    try {
      const comment = await this.commentsModel.findById(id);
      comment.likeCount += 1;
      return await comment.save();
    } catch (error) {}
  }
}
