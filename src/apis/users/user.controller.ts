import { ReqUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/models/user.model';

import {
  Body,
  Controller,
  Post,
  Param,
  UseGuards,
  Get,
  Patch,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { NicknameDto } from './dto/user.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { UpdateProfileReqDto } from './dto/updateUserDto.req.dto';
import { SuccessInterceptor } from 'src/common/interceptors/sucess.interceptor';
import { UserProfileDto } from 'src/common/dtos/UserProfile.dto';
import { ReportResultDtoResDto } from './dto/reportResultDto.res.dto';
import { CanChangeNicknameResDto } from './dto/canChangeNickname.res.dto';
import { NewAlarmStateResDto } from './dto/newAlarmState.res.dto';
import { SendLightningSuccessDtoResDto } from './dto/sendLigningSuccessDto.res.dto';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '내 정보를 가져온다.' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: User,
  })
  @Get('')
  async getMyUserInfo(@ReqUser() user: User) {
    // findOneByUserId
    return await this.userService.getUserInfo(user.userIdDto);
  }

  @ApiOperation({ summary: '유저 정보 수정' })
  @ApiBody({ type: UpdateProfileReqDto })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: User,
  })
  @Patch('')
  async updateProfile(
    @Body() updateProfileReqDto: UpdateProfileReqDto,
    @ReqUser() user: User,
  ): Promise<User> {
    return await this.userService.updateProfile(
      user.userIdDto,
      updateProfileReqDto,
    );
  }
  //
  @ApiOperation({ summary: '상대방 유저정보를 가져온다.' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 400,
    description: '차단된 유저 ,또는 없는 유저일경우',
  })
  @Get(':userId')
  async getOtherUserInfo(@Param() UserIdDto: UserIdDto, @ReqUser() user: User) {
    // findOneByUserId
    return await this.userService.getOtherUserInfo(
      UserIdDto,
      user.blockedUserDto,
    );
  }

  @ApiOperation({ summary: '상대방 유저를 차단한다' })
  @Post(':userId/block')
  @ApiResponse({
    status: 201,
    description: '요청 성공시',
    type: User,
  })
  blockUser(@Param() otherUSerIdDto: UserIdDto, @ReqUser() user: User) {
    return this.userService.blockUser(user.userIdDto, otherUSerIdDto);
  }

  @ApiOperation({ summary: '상대방 유저를 차단해지한다' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: User,
  })
  @Delete(':userId/block')
  unblockUser(@Param() otherUSerIdDto: UserIdDto, @ReqUser() user: User) {
    return this.userService.upBlockUser(user.userIdDto, otherUSerIdDto);
  }

  //완료

  @ApiOperation({ summary: '상대방 유저를 신고한다.' })
  @Post(':userId/report')
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: ReportResultDtoResDto,
  })
  reportUser(@Param() reportedIdDto: UserIdDto, @ReqUser() user: User) {
    return this.userService.reportUser(user.userIdDto, reportedIdDto);
  }

  @ApiOperation({
    summary: '닉네임이 유효한지 , 내가 들어가있는 방정보가 있는지 확인한다.',
  })
  @Get('canChange/:nickname')
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: CanChangeNicknameResDto,
  })
  checkNicknameAndChangePossible(
    @Param() nicknameDto: NicknameDto,
    @ReqUser() user: User,
  ) {
    return this.userService.checkNicknameAndChangePossible(
      user.userIdDto,
      nicknameDto,
    );
  }

  @ApiOperation({
    summary: '알림 토글 ( 최신 상태를 리턴 )',
  })
  @Patch('alarm')
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: NewAlarmStateResDto,
  })
  toggleAppAlarm(@ReqUser() user: User) {
    return this.userService.toggleAlarmAlarm(user.userIdDto);
  }

  @ApiOperation({
    summary: '상대방에게 번개를 보낸다',
  })
  @Post(':userId/lightning')
  @ApiResponse({
    status: 201,
    description: '요청 성공시',
    type: SendLightningSuccessDtoResDto,
  })
  @ApiResponse({
    status: 201,
    description: '이미 요청되었으면하루에 한번  ',
    type: SendLightningSuccessDtoResDto,
  })
  sendLightningToUser(@ReqUser() user: User, @Param() userIdDto: UserIdDto) {
    return this.userService.sendLightningToUser(user.userIdDto, userIdDto);
  }
}
