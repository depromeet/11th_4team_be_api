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
import { QuestionIdDto } from 'src/common/dtos/QuestionId.dto';
import { User } from 'src/models/user.model';
import { QuestionFindRequestDto } from './dto/QuestionsList.req.dto';

@ApiTags('questions')
@Controller('questions')
@ApiBearerAuth('accessToken')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  @ApiOperation({
    summary: '질문의 목록을 뽑아온다',
  })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: QuestionFindRequestDto,
  })
  @Get()
  findQuestions(
    @Query() questionFindRequestDto: QuestionFindRequestDto,
    @ReqUser() user: User,
  ) {
    console.log(user);
    // console.log(FindRoomDto);
    // 경도lng 위도lat
    // return this.roomsService.findRoom(FindRoomDto, new UserIdDto(user._id));
    return '';
  }

  @ApiOperation({ summary: '더미 질문 생성' })
  //   @ApiBody({ type: UpdateProfileDto })
  @Post('')
  async createQuestion(
    // @Body() updateProfileData: UpdateProfileDto,
    @ReqUser() user: User,
  ): Promise<any> {
    console.log(user);
    // await this.userService.updateProfile(user._id, updateProfileData);
    return '';
  }

  @ApiOperation({ summary: '질문의 세부정보를 가져온다. 댓글 목록 포함' })
  //   @ApiBody({ type: UpdateProfileDto })
  @Get(':questionId')
  async findQuestionById(
    @Param() questionIdDto: QuestionIdDto,
    // @Body() updateProfileData: UpdateProfileDto,
    @ReqUser() user: User,
  ): Promise<any> {
    console.log(user);
    // await this.userService.updateProfile(user._id, updateProfileData);
    return '';
  }

  @ApiOperation({ summary: '내가 올린 질문 삭제' })
  //   @ApiBody({ type: UpdateProfileDto })
  @Delete(':questionId')
  async updateProfile(
    @Param() questionIdDto: QuestionIdDto,
    // @Body() updateProfileData: UpdateProfileDto,
    @ReqUser() user: User,
  ): Promise<any> {
    console.log(user);
    // await this.userService.updateProfile(user._id, updateProfileData);
    return '';
  }

  @ApiOperation({
    summary: '질문의 좋아요를 토글한다. 최신의 상태를 리턴해준다',
  })
  //   @ApiBody({ type: UpdateProfileDto })
  @Patch(':questionId/like')
  async toggleQuestionLike(
    @Param() questionIdDto: QuestionIdDto,
    // @Body() updateProfileData: UpdateProfileDto,
    @ReqUser() user: User,
  ): Promise<any> {
    console.log(user);
    // await this.userService.updateProfile(user._id, updateProfileData);
    return '';
  }

  @ApiOperation({
    summary: '질문에 댓글을 단다',
  })
  //   @ApiBody({ type: UpdateProfileDto })
  @Post(':questionId/comment')
  async createCommentToQuestion(
    @Param() questionIdDto: QuestionIdDto,
    // @Body() updateProfileData: UpdateProfileDto,
    @ReqUser() user: User,
  ): Promise<any> {
    console.log(user);
    // await this.userService.updateProfile(user._id, updateProfileData);
    return '';
  }

  @ApiOperation({
    summary: '질문의 댓글을 삭제한다.',
  })
  //   @ApiBody({ type: UpdateProfileDto })
  @Delete(':questionId/comment')
  async deletCommentToQuestion(
    @Param() questionIdDto: QuestionIdDto,
    // @Body() updateProfileData: UpdateProfileDto,
    @ReqUser() user: User,
  ): Promise<any> {
    console.log(user);
    // await this.userService.updateProfile(user._id, updateProfileData);
    return '';
  }
}
