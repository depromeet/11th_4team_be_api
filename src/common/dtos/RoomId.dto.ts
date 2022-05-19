import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { MongoIdValidationTransfrom } from '../decorators/MongoIdValidationTransfrom.decorator';

/**
 * mongoId 용 DTO
 */
export class RoomIdDto {
  constructor(roomId: string | Types.ObjectId) {
    if (roomId instanceof Types.ObjectId) {
      this.roomId = roomId;
    } else {
      this.roomId = new Types.ObjectId(roomId);
    }
  }
  @ApiProperty({
    type: String,
    title: '룸 아이디',
    description: '몽고아이디 형식입니다. (홍익대학교 룸 예시 )',
    example: '62596e8c4e22b2180fe2a902',
  })
  @MongoIdValidationTransfrom({ toClassOnly: true })
  roomId: Types.ObjectId;
}
