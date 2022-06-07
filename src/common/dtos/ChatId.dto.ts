import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { MongoIdValidationTransfrom } from '../decorators/MongoIdValidationTransfrom.decorator';

/**
 * mongoId 용 DTO
 */
export class ChatIdDto {
  constructor(chatId: string | Types.ObjectId) {
    if (chatId instanceof Types.ObjectId) {
      this.chatId = chatId;
    } else {
      this.chatId = new Types.ObjectId(chatId);
    }
  }
  @ApiProperty({
    type: String,
    title: '챗 아이디',
    description: '찾고 싶은 질문을 챗  아이디로 찾습니다.',
    example: '62596e8c4e22b2180fe2a902',
  })
  @MongoIdValidationTransfrom({ toClassOnly: true })
  chatId: Types.ObjectId;
}
