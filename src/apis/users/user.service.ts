import { UserRepository } from 'src/repositories/user.repository';
import { Injectable } from '@nestjs/common';

import { User } from 'src/models/user.model';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  //
  // async createUser(createUser: CreateUserDto): Promise<User> {
  //   return await this.userRepository.create(createUser);
  // }
}
