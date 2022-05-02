import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/models/user.model';
import { QuestionFindRequestDto } from './dto/QuestionsList.req.dto';

@ApiTags('questions')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('questions')
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

  @ApiOperation({ summary: '유저 정보 수정' })
  @ApiBasicAuth()
  //   @ApiBody({ type: UpdateProfileDto })
  @Patch('')
  async updateProfile(
    // @Body() updateProfileData: UpdateProfileDto,
    @ReqUser() user: User,
  ): Promise<any> {
    console.log(user);
    // await this.userService.updateProfile(user._id, updateProfileData);
    return '';
  }
}
