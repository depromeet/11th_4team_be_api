import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';
import { MongoIdValidationTransfrom } from '../decorators/MongoIdValidationTransfrom.decorator';
/**
 * mongoId 용 DTO
 */
export class LetterRoomIdDto {
  constructor(letterRoomId: string) {
    this.letterRoomId = new Types.ObjectId(letterRoomId);
  }

  @ApiProperty({
    type: String,
    title: '쪽지방 아이디',
    description: '몽고아이디 형식입니다.',
    // example: '624c24cae25c551b68a6645c',
  })
  @MongoIdValidationTransfrom({ toClassOnly: true })
  letterRoomId: Types.ObjectId;
}
