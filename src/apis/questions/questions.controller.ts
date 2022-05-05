import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { CommentIdDto } from 'src/common/dtos/CommentId.dto';
import { QuestionIdDto } from 'src/common/dtos/QuestionId.dto';
import { MongooseClassSerializerInterceptor } from 'src/common/interceptors/mongooseClassSerializer.interceptor';
import { SuccessInterceptor } from 'src/common/interceptors/sucess.interceptor';
import { ObjectIdValidationPipe } from 'src/common/pipes/ObjectIdCheck.pipe';
import { Comment, Question } from 'src/models/question.model';
import { User } from 'src/models/user.model';
import { CommentStringDto } from './dto/CommentString.dto';
import { IlikeResDto } from './dto/Ilike.res.dto';
import { QuestionShowDto } from './dto/Question.res.dto';
import { QuestionFindRequestDto } from './dto/QuestionsList.req.dto';
import { QuestionsService } from './questions.service';

@ApiTags('questions')
@Controller('questions')
@ApiBearerAuth('accessToken')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(SuccessInterceptor)
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly questionService: QuestionsService) {}

  @ApiOperation({
    summary: '질문의 목록을 뽑아온다',
  })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: [QuestionShowDto],
  })
  @Get()
  findQuestions(
    @Query() questionFindRequestDto: QuestionFindRequestDto,
    @ReqUser() user: User,
  ) {
    return this.questionService.findQuestions(
      user.userIdDto,
      questionFindRequestDto,
    );
  }

  // @ApiOperation({ summary: '더미 질문 생성' })
  // //   @ApiBody({ type: UpdateProfileDto })
  // @Post('')
  // async createQuestion(
  //   // @Body() updateProfileData: UpdateProfileDto,
  //   @ReqUser() user: User,
  // ): Promise<any> {
  //   console.log(user);
  //   // await this.userService.updateProfile(user._id, updateProfileData);
  //   return '';
  // }

  @ApiOperation({ summary: '질문의 세부정보를 가져온다. 댓글 목록 포함' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: QuestionShowDto,
  })
  @Get(':questionId')
  async findQuestionById(
    @Param() questionIdDto: QuestionIdDto,
    @ReqUser() user: User,
  ): Promise<any> {
    return await this.questionService.findQuestionById(
      user.userIdDto,
      questionIdDto,
    );
  }

  @ApiOperation({ summary: '내가 올린 질문 삭제' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: QuestionShowDto,
  })
  @Delete(':questionId')
  async updateProfile(
    @Param() questionIdDto: QuestionIdDto,
    // @Body() updateProfileData: UpdateProfileDto,
    @ReqUser() user: User,
  ): Promise<any> {
    return await this.questionService.deleteQuestionByQuestionId(
      user.userIdDto,
      questionIdDto,
    );
  }

  @ApiOperation({
    summary: '질문의 좋아요를 토글한다. 최신의 상태를 리턴해준다',
  })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: IlikeResDto,
  })
  @Patch(':questionId/likes')
  async toggleQuestionLike(
    @Param() questionIdDto: QuestionIdDto,
    // @Body() updateProfileData: UpdateProfileDto,
    @ReqUser() user: User,
  ): Promise<any> {
    return await this.questionService.toggleQuestionLike(
      user.userIdDto,
      questionIdDto,
    );
  }

  @ApiOperation({
    summary: '질문에 댓글을 단다',
  })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: Comment,
  })
  @Post(':questionId/comments')
  async createCommentToQuestion(
    @Param() questionIdDto: QuestionIdDto,
    @Body() commentStringDto: CommentStringDto,
    @ReqUser() user: User,
  ): Promise<Comment[]> {
    console.log(user);

    return await this.questionService.createCommentToQuestion(
      user.userIdDto,
      questionIdDto,
      commentStringDto,
    );
  }

  @ApiOperation({
    summary: '질문의 댓글을 삭제한다.',
  })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: Comment,
  })
  @Delete(':questionId/comments/:commentId')
  async deletCommentFromQuestion(
    @Param('questionId', new ObjectIdValidationPipe('questionId'))
    questionIdDto: string,
    @Param('commentId', new ObjectIdValidationPipe('commentId'))
    commentIdDto: string,
    @ReqUser() user: User,
  ): Promise<Comment[]> {
    console.log(questionIdDto, commentIdDto);

    return await this.questionService.deleteCommentFromQuestion(
      user.userIdDto,
      new QuestionIdDto(questionIdDto),
      new CommentIdDto(commentIdDto),
    );
  }
}
