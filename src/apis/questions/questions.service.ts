import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { QUESTION_FIND_FILTER_TYPE } from 'src/common/consts/enum';
import { returnValueToDto } from 'src/common/decorators/returnValueToDto.decorator';
import { CommentIdDto } from 'src/common/dtos/CommentId.dto';
import { QuestionIdDto } from 'src/common/dtos/QuestionId.dto';
import { RoomIdDto } from 'src/common/dtos/RoomId.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { Comment, Question } from 'src/models/question.model';
import { QuestionRepository } from 'src/repositories/question.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { CommentStringDto } from './dto/commentString.dto';
import { IlikeResDto } from './dto/Ilike.res.dto';
import { QuestionShowDto } from './dto/Question.res.dto';
import { QuestionFindRequestDto } from './dto/QuestionsList.req.dto';

@Injectable()
export class QuestionsService {
  constructor(
    private userRepository: UserRepository,
    private questionRepository: QuestionRepository,
  ) {}

  // always should check if i join the room.
  private async checkMyRoom(userIdDto: UserIdDto): Promise<RoomIdDto> {
    const user = await this.userRepository.findOneByUserId(userIdDto);
    if (!user.myRoom) {
      throw new BadRequestException('들어간 방이 없습니다.');
    }
    return new RoomIdDto(user.myRoom._id);
  }

  @returnValueToDto(QuestionShowDto)
  async findQuestions(
    userIdDto: UserIdDto,
    questionFindRequestDto: QuestionFindRequestDto,
  ): Promise<QuestionShowDto[]> {
    // 내 아이디 정보를 넣어서 비교로직 추가가 필요함.
    const myRoomIdDto = await this.checkMyRoom(userIdDto);
    let result = [];
    switch (questionFindRequestDto.filter) {
      case QUESTION_FIND_FILTER_TYPE.NOTANSWERED:
        result = await this.questionRepository.getQuestionsByRoomIdNotAnswerd(
          myRoomIdDto,
        );
        break;
      case QUESTION_FIND_FILTER_TYPE.OLDORDER:
        result = await this.questionRepository.getQuestionsByRoomIdOldOrder(
          myRoomIdDto,
        );
        break;
      case QUESTION_FIND_FILTER_TYPE.NEWORDER:
        result = await this.questionRepository.getQuestionsByRoomIdNewOrder(
          myRoomIdDto,
        );

        break;
    }

    result.forEach(function (element) {
      element.myUserId = userIdDto.userId;
    });

    return result;
  }

  @returnValueToDto(QuestionShowDto)
  async findQuestionById(userIdDto: UserIdDto, questionIdDto: QuestionIdDto) {
    // 내 아이디 정보를 넣어서 비교로직 추가가 필요함.
    await this.checkMyRoom(userIdDto);
    const question = await this.questionRepository.getQuestionByQuestionId(
      questionIdDto,
    );
    if (!question) {
      throw new BadRequestException('질문 없음');
    }
    question.myUserId = userIdDto.userId;

    return question;
  }

  // 삭제된 여부 똑같이 리턴해주장.
  @returnValueToDto(QuestionShowDto)
  async deleteQuestionByQuestionId(
    userIdDto: UserIdDto,
    questionIdDto: QuestionIdDto,
  ) {
    // 내 아이디 정보를 넣어서 비교로직 추가가 필요함.
    // await this.checkMyRoom(userIdDto);
    // TODO : 삭제시 채팅 삭제도 필요...
    const question = await this.questionRepository.getQuestionByQuestionId(
      questionIdDto,
    );
    if (!question.user._id.equals(userIdDto.userId)) {
      throw new BadRequestException('권한없음');
    }

    const result = await this.questionRepository.deleteQuestionsByQuestionId(
      questionIdDto,
    );
    result.myUserId = userIdDto.userId;
    return result;
  }

  @returnValueToDto(IlikeResDto)
  async toggleQuestionLike(userIdDto: UserIdDto, questionIdDto: QuestionIdDto) {
    // 내 아이디 정보를 넣어서 비교로직 추가가 필요함.
    // await this.checkMyRoom(userIdDto);
    const question = await this.questionRepository.getQuestionByQuestionId(
      questionIdDto,
    );
    const checkILiked = question.likes.find((user) =>
      user._id.equals(userIdDto.userId),
    );
    let result: Question;
    let ilike: boolean;
    if (checkILiked) {
      // 내가 좋아요 눌렀었으면
      result = await this.questionRepository.pullUserToQuestionLikes(
        userIdDto,
        questionIdDto,
      );
      ilike = false;
    } else {
      result = await this.questionRepository.pushUserToQuestionLikes(
        userIdDto,
        questionIdDto,
      );
      ilike = true;
    }

    if (!result) {
      throw new BadRequestException('질문 없음');
    }
    return { ilike };
  }

  @returnValueToDto(Comment)
  async createCommentToQuestion(
    userIdDto: UserIdDto,
    questionIdDto: QuestionIdDto,
    commentStringDto: CommentStringDto,
  ) {
    // 내 아이디 정보를 넣어서 비교로직 추가가 필요함.
    const question = await this.questionRepository.addCommentToQuestion(
      userIdDto,
      commentStringDto,
      questionIdDto,
    );
    return question.commentList;
  }

  @returnValueToDto(Comment)
  async deleteCommentFromQuestion(
    userIdDto: UserIdDto,
    questionIdDto: QuestionIdDto,
    commentIdDto: CommentIdDto,
  ) {
    // 내 아이디 정보를 넣어서 비교로직 추가가 필요함.

    const question = await this.questionRepository.getQuestionByQuestionId(
      questionIdDto,
    );
    console.log(question);
    if (
      !question.commentList.find(
        (comment) =>
          comment.user._id.equals(userIdDto.userId) &&
          comment._id.equals(commentIdDto.commentId),
      )
    ) {
      throw new BadRequestException('권한없음');
    }

    const newQuestion = await this.questionRepository.pullCommentToQuestion(
      commentIdDto,
      questionIdDto,
    );
    return newQuestion.commentList;
  }
}
