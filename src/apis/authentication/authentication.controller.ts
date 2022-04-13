import { string } from 'joi';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PhoneNumberDto } from 'src/apis/users/dto/user.dto';
import { AuthenticationService } from './authentication.service';
import { CertificationMobileDto } from './dto/send-mobile.dto';

@ApiTags('authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @ApiOperation({ summary: '핸드폰 인증번호 발송' })
  @ApiBody({ type: PhoneNumberDto })
  @Post('mobile')
  async userSendMobileForUser(
    @Body() data: PhoneNumberDto,
  ): Promise<CertificationMobileDto> {
    return await this.authenticationService.sendMobileAuthNumber(data);
  }

  @ApiOperation({ summary: '핸드폰 인증번호 인증' })
  @Post('mobile/:inputNumber')
  async certificationMobile(
    @Param('inputNumber') inputNumber: string,
  ): Promise<boolean> {
    return await this.authenticationService.certificationMobile(inputNumber);
  }
}
