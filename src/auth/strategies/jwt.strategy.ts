import { UserRepository } from './../../repositories/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ACCOUNT_TYPE, TOKEN_ERROR_CODE } from 'src/common/consts/enum';
import { errorBody } from 'src/common/funcs/error.func';
import { JwtStrategyConfig } from '../jwt-config';
import { Payload } from '../jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userRepository: UserRepository) {
    super(JwtStrategyConfig);
  }

  async validate(payload: Payload) {
    const user = await this.userRepository.findOneByUserId(payload.id);

    if (user) {
      return user;
    } else {
      throw new UnauthorizedException('접근 오류');
    }
  }
}
