import { ReqUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/models/user.model';

import {
  Body,
  Controller,
  Post,
  Param,
  Put,
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
  ApiParam,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiResponse,
  ApiBasicAuth,
} from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/user.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { UpdateProfileReqDto } from './dto/updateUserDto.req.dto';
import { SuccessInterceptor } from 'src/common/interceptors/sucess.interceptor';

@ApiTags('user')
@ApiBasicAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@UseInterceptors(SuccessInterceptor)
@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: '내 정보를 가져온다.' })
  @Get('')
  async getMyUserInfo() {
    // findOneByUserId
    // return await this.userService.createUser(createUserDto);
    return '';
  }

  @ApiOperation({ summary: '유저 정보 수정' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateProfileReqDto })
  @Patch('')
  async updateProfile(
    @Body() updateProfileReqDto: UpdateProfileReqDto,
    @ReqUser() user: User,
  ): Promise<any> {
    console.log(user);
    // updateProfile
    // await this.userService.updateProfile(user._id, updateProfileData);
    return '';
  }
  //
  @ApiOperation({ summary: '상대방 유저정보를 가져온다.' })
  @Get(':userId')
  async getUserInfo() {
    // findOneByUserId
    // return await this.userService.createUser(createUserDto);
    return '';
  }

  @ApiOperation({ summary: '상대방 유저를 차단한다' })
  @Post(':userId/block')
  // @ApiResponse({
  //   status: 200,
  //   description: '요청 성공시',
  //   type: ResChatAlarmToggleDto,
  // })
  blockUser(@Param() userId: UserIdDto, @ReqUser() user: User) {
    // return this.roomsService.toggleChatAlarm(new UserIdDto(user._id));
    return '';
  }

  @ApiOperation({ summary: '상대방 유저를 차단해지한다' })
  @Delete(':userId/block')
  // @ApiResponse({
  //   status: 200,
  //   description: '요청 성공시',
  //   type: ResChatAlarmToggleDto,
  // })
  unblockUser(@Param() userId: UserIdDto, @ReqUser() user: User) {
    // return this.roomsService.toggleChatAlarm(new UserIdDto(user._id));
    return '';
  }

  //완료

  @ApiOperation({ summary: '상대방 유저를 신고한다.' })
  @Post(':userId/report')
  // @ApiResponse({
  //   status: 200,
  //   description: '요청 성공시',
  //   type: ResChatAlarmToggleDto,
  // })
  reportUser(@Param() userId: UserIdDto, @ReqUser() user: User) {
    // return this.roomsService.toggleChatAlarm(new UserIdDto(user._id));
    return '';
  }

  @ApiOperation({
    summary: '닉네임이 유효한지 , 내가 들어가있는 방정보가 있는지 확인한다.',
  })
  @Post('valid/nickname')
  // @ApiResponse({
  //   status: 200,
  //   description: '요청 성공시',
  //   type: ResChatAlarmToggleDto,
  // })
  checkNicknameAndChangePossible(
    @Param() userId: UserIdDto,
    @ReqUser() user: User,
  ) {
    //findOneBy nickname
    //my room exist
    // return this.roomsService.toggleChatAlarm(new UserIdDto(user._id));
    return '';
  }

  @ApiOperation({
    summary: '알림 토글 ( 최신 상태를 리턴 )',
  })
  @Patch('alarm')
  // @ApiResponse({
  //   status: 200,
  //   description: '요청 성공시',
  //   type: ResChatAlarmToggleDto,
  // })
  toggleAlarmState(@Param() userId: UserIdDto, @ReqUser() user: User) {
    // return this.roomsService.toggleChatAlarm(new UserIdDto(user._id));
    return '';
  }
}
