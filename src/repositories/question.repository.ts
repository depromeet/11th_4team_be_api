import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { Comment, Question } from 'src/models/question.model';
import { RoomIdDto } from 'src/common/dtos/RoomId.dto';
import { QuestionIdDto } from 'src/common/dtos/QuestionId.dto';
import { UserProfileSelect } from 'src/common/dtos/UserProfile.dto';
import { CommentStringDto } from 'src/apis/questions/dto/CommentString.dto';
import { CommentIdDto } from 'src/common/dtos/CommentId.dto';

@Injectable()
export class QuestionRepository {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
  ) {}

  // 질문의 목록을 가져온다. 방정보를 토대로.
  async getQuestionsByRoomIdOldOrder(
    roomIdDto: RoomIdDto,
  ): Promise<Question[]> {
    return await this.questionModel
      .find({ room: roomIdDto.roomId })
      .populate({
        path: 'user',
        select: UserProfileSelect,
      })
      .lean<Question[]>({ defaults: true });
  }

  async getQuestionsByRoomIdNewOrder(
    roomIdDto: RoomIdDto,
  ): Promise<Question[]> {
    return await this.questionModel
      .find({ room: roomIdDto.roomId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: UserProfileSelect,
      })
      .lean<Question[]>({ defaults: true });
  }

  async getQuestionsByRoomIdNotAnswerd(
    roomIdDto: RoomIdDto,
  ): Promise<Question[]> {
    return await this.questionModel
      .find({ room: roomIdDto.roomId, commentList: { $size: 0 } })
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: UserProfileSelect,
      })
      .lean<Question[]>({ defaults: true });
  }

  async getQuestionByQuestionId(
    questionIdDto: QuestionIdDto,
  ): Promise<Question | null> {
    return await this.questionModel
      .findOne({ _id: questionIdDto.questionId })
      .populate({
        path: 'user',
        select: UserProfileSelect,
      })
      .populate({
        path: 'commentList.user',
        select: UserProfileSelect,
      })
      .lean<Question>({ defaults: true });
  }

  async deleteQuestionsByQuestionId(
    questionIdDto: QuestionIdDto,
  ): Promise<Question | null> {
    return await this.questionModel
      .deleteOne({ _id: questionIdDto.questionId })
      .lean<Question>({ defaults: true });
  }

  // in service layer return ilike : true
  async pushUserToQuestionLikes(
    userIdDto: UserIdDto,
    questionIdDto: QuestionIdDto,
  ): Promise<Question | null> {
    return await this.questionModel
      .findOneAndUpdate(
        {
          _id: questionIdDto.questionId,
        },
        {
          $addToSet: {
            likes: userIdDto.userId,
          },
        },
        { new: true },
      )
      .lean<Question>({ defaults: true });
  }

  // in service layer return ilike : false
  async pullUserToQuestionLikes(
    userIdDto: UserIdDto,
    questionIdDto: QuestionIdDto,
  ): Promise<Question | null> {
    return await this.questionModel
      .findOneAndUpdate(
        {
          _id: questionIdDto.questionId,
        },
        {
          $pull: {
            likes: userIdDto.userId,
          },
        },
        { new: true },
      )
      .lean<Question>({ defaults: true });
  }

  // 댓글 목록을보내주자.
  async addCommentToQuestion(
    userIdDto: UserIdDto,
    commentStringDto: CommentStringDto,
    questionIdDto: QuestionIdDto,
  ): Promise<Question | null> {
    const comment = {
      user: userIdDto.userId,
      comment: commentStringDto.comment,
    };
    return await this.questionModel
      .findOneAndUpdate(
        {
          _id: questionIdDto.questionId,
        },
        {
          $push: {
            commentList: comment,
          },
        },
        { new: true },
      )
      .populate({
        path: 'commentList.user',
        select: UserProfileSelect,
      })
      .lean<Question>({ defaults: true });
  }

  // 서비스 레이어에서 댓글 목록을 리턴
  async pullCommentToQuestion(
    commentIdDto: CommentIdDto,
    questionIdDto: QuestionIdDto,
  ): Promise<Question | null> {
    return await this.questionModel
      .findOneAndUpdate(
        {
          _id: questionIdDto.questionId,
        },
        {
          $pull: {
            commentList: { _id: commentIdDto.commentId },
          },
        },
        { new: true },
      )
      .populate({
        path: 'commentList.user',
        select: UserProfileSelect,
      })
      .lean<Question>({ defaults: true });
  }
}