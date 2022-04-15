import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PhoneNumberDto } from 'src/apis/users/dto/user.dto';
import { LOGIN_ERROR_CODE } from 'src/common/consts/enum';
import { errorBody } from 'src/common/funcs/error.func';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(data: PhoneNumberDto) {
    // 해당하는 계정이 있는지
    const user = await this.userRepository.findOneByPhoneNumber(data);
    if (!user) {
      throw new UnauthorizedException('휴대폰 번호 확인바람');
    }

    const payload = { _id: user._id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
