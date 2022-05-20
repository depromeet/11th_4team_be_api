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

import { User } from 'src/models/user.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import { AlarmService } from './alarm.service';
import { AlarmShowDto } from './dto/alarmShow.dto';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { AlarmIdDto } from 'src/common/dtos/AlarmId.dto';
import { PageLastIdDto } from 'src/common/dtos/PageLastIdDto';

@ApiTags('notis')
@Controller('notis')
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard)
export class NotiController {
  constructor(private readonly alarmService: AlarmService) {}

  @ApiOperation({
    summary: '내 알림을 불러온다.',
  })
  @Get('')
  @ApiResponse({
    status: 201,
    description: '요청 성공시',
    type: [AlarmShowDto],
  })
  getMyAllAlarm(@ReqUser() user: User, @Query() pageLastIdDto: PageLastIdDto) {
    console.log('asdfasdfasdf', pageLastIdDto);
    return this.alarmService.getMyAlarms(user.userIdDto, pageLastIdDto);
  }

  @ApiOperation({
    summary: '내 알림을 다 보게끔 한다.',
  })
  @Patch('watchAll')
  @ApiResponse({
    status: 201,
    description: '요청 성공시',
    type: [AlarmShowDto],
  })
  watchAllAlarm(@ReqUser() user: User) {
    return this.alarmService.watchAllAlarm(user.userIdDto);
  }

  @ApiOperation({
    summary: '내 알림 보는걸로 처리',
  })
  @Patch(':alarmId')
  @ApiResponse({
    status: 200,
    description: '성공 응답만 리턴',
  })
  watchOneAlarm(@ReqUser() user: User, @Param() alarmIdDto: AlarmIdDto) {
    return this.alarmService.watchAlarm(user.userIdDto, alarmIdDto);
  }
}
