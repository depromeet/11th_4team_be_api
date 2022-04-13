import { ReqUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/models/user.model';
import { AuthenticationService } from '../authentication/authentication.service';
import {
  Body,
  Controller,
  Post,
  Param,
  Put,
  UseGuards,
  Get,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import {
  ResponseSignIn,
  ResponseSignUp,
} from 'src/common/decorators/response.decorator';
import { UserService } from './user.service';
import { PhoneNumberDto, UpdateProfileDto } from './dto/user.dto';
import { ObjectId } from 'mongoose';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: '휴대폰 번호 중복여부' })
  @Post('phoneNumber/duplicate')
  async checkDuplicatePhoneNumber(
    @Body() data: PhoneNumberDto,
  ): Promise<boolean> {
    return await this.userService.checkDuplicatePhoneNumber(data);
  }

  @ApiOperation({ summary: '유저 가입' })
  @ResponseSignUp()
  @ApiBody({ type: PhoneNumberDto, description: '나중에 payload의 id로 대체' })
  @Post('signUp/:inputNumber')
  async signUp(
    @Body() data: PhoneNumberDto,
    @Param('inputNumber') inputNumber: string,
  ): Promise<User> {
    const isAuthPass = await this.authenticationService.certificationMobile(
      inputNumber,
    );
    if (isAuthPass) {
      return await this.userService.signUp(data);
    }
  }

  @ApiOperation({ summary: '로그인 - 인증번호(현재는 번호)' })
  @ApiUnauthorizedResponse({
    description: `
    code - 
    0: 휴대폰 번호가 없을 경우
    1: 인증번호가 일치하지 않을 경우
    2: 계정이 잠겼을 경우,
    3: 계정이 비활성화된 경우`,
  })
  @ResponseSignIn()
  @ApiBody({ type: PhoneNumberDto })
  @Post('signIn')
  async login(@Body() data: PhoneNumberDto) {
    return await this.authService.signUp(data);
  }

  @ApiOperation({ summary: '유저 정보 수정' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateProfileDto })
  @Put('profile')
  async updateProfile(
    @Body() updateProfileData: UpdateProfileDto,
    @ReqUser() user: User,
  ): Promise<any> {
    return await this.userService.updateProfile(user._id, updateProfileData);
  }
}
