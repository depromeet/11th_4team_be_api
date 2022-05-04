import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PhoneNumberDto } from 'src/apis/users/dto/user.dto';
import { LOGIN_ERROR_CODE } from 'src/common/consts/enum';
import { errorBody } from 'src/common/funcs/error.func';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor() {}
}
