import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PhoneNumberDto } from 'src/apis/users/dto/user.dto';
import { UserService } from 'src/apis/users/user.service';
import { LOGIN_ERROR_CODE } from 'src/common/consts/enum';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { errorBody } from 'src/common/funcs/error.func';
import { Forbidden } from 'src/models/forbidden.model';
import { ForbiddenRepository } from 'src/repositories/forbidden.repository';
import { ReportRepository } from 'src/repositories/report.repository';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly reportRepository: ReportRepository,
    // private readonly userRepository: UserRepository,
    private readonly forbiddenRepository: ForbiddenRepository,
    // private readonly userService: UserService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async createForbidden(userIdDto: UserIdDto): Promise<Forbidden> {
    await this.userService.banUser(userIdDto);
    return await this.forbiddenRepository.createForbidden(userIdDto);
  }

  async findOneForbiddenByUserId(
    userIdDto: UserIdDto,
  ): Promise<Forbidden | null> {
    return await this.forbiddenRepository.findOneForbiddenByUserId(userIdDto);
  }

  async unBanUser(userIdDto: UserIdDto) {
    await this.userService.unBanUser(userIdDto);
  }
}
