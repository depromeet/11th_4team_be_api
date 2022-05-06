import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  SerializeOptions,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UserIdDto } from 'src/common/dtos/UserId.dto';

import { ReqUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/models/user.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { LetterService } from './letter.service';
import { TwoUserListDto } from './dto/twoUserList.dto';
import { MessageStringDto } from './dto/messageString.dto';
import { instanceToPlain } from 'class-transformer';
import { LetterRoomDto } from './dto/LetterRoom.res.dto';
import { LetterRoomIdDto } from 'src/common/dtos/LetterRoomId.dto';
import { ResLetterDto } from './dto/Letter.res.dto';
import { SuccessInterceptor } from 'src/common/interceptors/sucess.interceptor';

@ApiTags('letters')
@Controller('letters')
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(SuccessInterceptor)
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  @ApiOperation({ summary: '편지를 상대방에게 보낼 수 있음' })
  @ApiResponse({
    status: 201,
    description: '요청 성공시',
    type: ResLetterDto,
  })
  @Post(':userId')
  sendLetterToReciever(
    @Query() receiver: UserIdDto,
    @ReqUser() user: User,
    @Body() messageStringDto: MessageStringDto,
  ) {
    const twoUserList = new TwoUserListDto(receiver, new UserIdDto(user._id));
    return this.letterService.sendLetterToReciever(
      twoUserList,
      messageStringDto,
    );
  }

  // 시리얼라이징 적용 필요
  @ApiOperation({ summary: '상대방과 편지를 한걸 모아볼수있음' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: [ResLetterDto],
  })
  @Get(':letterRoomId')
  getRoomInLetters(
    @Query() letterRoomIdDto: LetterRoomIdDto,
    @ReqUser() user: User,
  ) {
    return this.letterService.getLettersByRoomId(
      letterRoomIdDto,
      new UserIdDto(user._id),
    );
  }

  @ApiOperation({ summary: '쪽지탭용' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: [LetterRoomDto],
  })
  @Get('')
  async getLetterRooms(@ReqUser() user: User) {
    const list = await this.letterService.getRoomsByMyUserId(
      new UserIdDto(user._id),
    );
    console.log(instanceToPlain(list[0]));
    return list;
  }

  @ApiOperation({ summary: '쪽지룸을 떠남' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: [LetterRoomDto],
  })
  @Delete(':letterRoomId')
  deleteLetterRooms(
    @Query() letterRoomIdDto: LetterRoomIdDto,
    @ReqUser() user: User,
  ) {
    return this.letterService.leaveLetterRoomByRoomId(
      letterRoomIdDto,
      new UserIdDto(user._id),
    );
  }
}
