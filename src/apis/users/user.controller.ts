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
import { NicknameDto, UpdateProfileDto } from './dto/user.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { UpdateProfileReqDto } from './dto/updateUserDto.req.dto';
import { SuccessInterceptor } from 'src/common/interceptors/sucess.interceptor';
import { MongooseClassSerializerInterceptor } from 'src/common/interceptors/mongooseClassSerializer.interceptor';
import { LoggingInterceptor } from 'src/common/interceptors/test.interceptors';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth('accessToken')
@UseInterceptors(SuccessInterceptor)
// @UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '내 정보를 가져온다.' })
  @MongooseClassSerializerInterceptor(User)
  @Get('')
  async getMyUserInfo(@ReqUser() user: User) {
    // findOneByUserId
    return await this.userService.getUserInfo(user.userIdDto);
  }

  @ApiOperation({ summary: '유저 정보 수정' })
  @ApiBody({ type: UpdateProfileReqDto })
  @Patch('')
  async updateProfile(
    @Body() updateProfileReqDto: UpdateProfileReqDto,
    @ReqUser() user: User,
  ): Promise<any> {
    console.log(user);

    await this.userService.updateProfile(user.userIdDto, updateProfileReqDto);
  }
  //
  @ApiOperation({ summary: '상대방 유저정보를 가져온다.' })
  @Get(':userId')
  async getUserInfo(@Param() UserIdDto: UserIdDto) {
    // findOneByUserId
    return await this.userService.getUserInfo(UserIdDto);
  }

  @ApiOperation({ summary: '상대방 유저를 차단한다' })
  @Post(':userId/block')
  // @ApiResponse({
  //   status: 200,
  //   description: '요청 성공시',
  //   type: ResChatAlarmToggleDto,
  // })
  blockUser(@Param() otherUSerIdDto: UserIdDto, @ReqUser() user: User) {
    return this.userService.blockUser(user.userIdDto, otherUSerIdDto);
  }

  @ApiOperation({ summary: '상대방 유저를 차단해지한다' })
  @Delete(':userId/block')
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: null,
  })
  unblockUser(@Param() otherUSerIdDto: UserIdDto, @ReqUser() user: User) {
    return this.userService.upBlockUser(user.userIdDto, otherUSerIdDto);
  }

  //완료

  @ApiOperation({ summary: '상대방 유저를 신고한다.' })
  @Post(':userId/report')
  // @ApiResponse({
  //   status: 200,
  //   description: '요청 성공시',
  //   type: ResChatAlarmToggleDto,
  // })
  // 리턴 타입 정제 필요
  reportUser(@Param() reportedIdDto: UserIdDto, @ReqUser() user: User) {
    return this.userService.reportUser(user.userIdDto, reportedIdDto);
  }

  @ApiOperation({
    summary: '닉네임이 유효한지 , 내가 들어가있는 방정보가 있는지 확인한다.',
  })
  @Get('canChange/:nickname')
  // @ApiResponse({
  //   status: 200,
  //   description: '요청 성공시',
  //   type: ResChatAlarmToggleDto,
  // })
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
  // @ApiResponse({
  //   status: 200,
  //   description: '요청 성공시',
  //   type: ResChatAlarmToggleDto,
  // })
  toggleAppAlarm(@ReqUser() user: User) {
    return this.userService.toggleAlarmAlarm(user.userIdDto);
  }
}
