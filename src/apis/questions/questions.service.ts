import { Injectable } from '@nestjs/common';
import { RoomIdDto } from 'src/common/dtos/RoomId.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { QuestionRepository } from 'src/repositories/question.repository';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class QuestionsService {
  constructor(
    private userRepository: UserRepository,
    private questionRepository: QuestionRepository,
  ) {}

  //   private async checkMyRoom(userIdDto: UserIdDto): Promise<RoomIdDto | null> {
  //     const user = await this.userRepository.findOneByUserId(userIdDto);
  //     user.myRoom
  //   }
  //   async findQuestions(userIdDto: UserIdDto): Promise<User> {
  //     // auto 시리얼 라이징
  //     return await this.userRepository.findOneByUserId(userIdDto);
  //   }
}
