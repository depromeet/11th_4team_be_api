import { UserRepository } from 'src/repositories/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PhoneNumberDto, UpdateProfileDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/models/user.model';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async checkDuplicatePhoneNumber(phoneNumber: PhoneNumberDto) {
    const user = await this.userRepository.findOneByPhoneNumber(phoneNumber);
    return user ? true : false;
  }

  // async signUp(data: PhoneNumberDto): Promise<any> {
  //   const user = await this.userRepository.findOneByPhoneNumber(data);
  //   if (user) {
  //     throw new UnauthorizedException('가입된 유저입니다');
  //   } else {
  //     return await this.userRepository.create(data);
  //   }
  // }

  async updateProfile(userId: string, data: UpdateProfileDto): Promise<any> {
    const { nickname } = data;
    const user = await this.userRepository.findOneByUserId(userId);
    const usingNickname = await this.userRepository.existByNickName(nickname);

    if (user.nickname === nickname || usingNickname) {
      throw new UnauthorizedException(
        '동일한 닉네임 혹은 이미 사용중인 닉네임 존재',
      );
    } else {
      return await this.userRepository.updateProfile(data);
    }
  }

  //
  async createUser(createUser: CreateUserDto): Promise<User> {
    return await this.userRepository.create(createUser);
  }
}
