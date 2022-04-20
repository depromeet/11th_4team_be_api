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
import { MongoId } from 'src/common/dtos/MongoId.dto';
import { ObjectIdValidationPipe } from 'src/common/pipes/ObjectIdCheck.pipe';
import { ObjectId } from 'mongoose';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { RoomIdDto } from 'src/common/dtos/RoomId.dto';

import { ReqUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/models/user.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { LetterService } from './letter.service';
import { TwoUserListDto } from './dto/twoUserList.dto';
import { MessageStringDto } from './dto/messageString.dto';
import { instanceToInstance, instanceToPlain } from 'class-transformer';
import { LetterRoomDto } from './dto/LetterRoom.res.dto';

@ApiTags('letters')
@Controller('letters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class LetterController {
  constructor(private readonly letterService: LetterService) {}
  @ApiOperation({ summary: '편지를 상대방에게 보낼 수 있음' })
  //   @ApiBody({ type: CreateRoomDto })
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

  @ApiOperation({ summary: '상대방과 편지를 한걸 모아볼수있음' })
  //   @ApiBody({ type: CreateRoomDto })
  @Get(':letterRoomId')
  getRoomInLetters() {
    return '';
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: '쪽지탭용' })
  //   @ApiBody({ type: CreateRoomDto })
  @Get('')
  async getLetterRooms(@ReqUser() user: User) {
    const list = await this.letterService.getRoomsByMyUserId(
      new UserIdDto(user._id),
    );
    console.log(list[0].latestTime);
    return { lits: list };
  }

  @ApiOperation({ summary: '쪽지룸을 떠남' })
  //   @ApiBody({ type: CreateRoomDto })
  @Delete(':letterRoomId')
  deleteLetterRooms() {
    return '';
  }

  //   @ApiOperation({ summary: '쪽지룸을 떠남' })
  //   //   @ApiBody({ type: CreateRoomDto })
  //   @Delete('')
  //   deleteLetterRooms() {
  //     return '';
  //   }
}
