import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';
import { MongoIdValidationTransfrom } from '../decorators/MongoIdValidationTransfrom.decorator';
/**
 * mongoId 용 DTO
 */
export class UserIdDto {
  constructor(userId: string | Types.ObjectId) {
    if (userId instanceof Types.ObjectId) {
      this.userId = userId;
    } else {
      this.userId = new Types.ObjectId(userId);
    }
  }

  @ApiProperty({
    type: String,
    title: '유저 아이디',
    description: '몽고아이디 형식입니다. (개발자) ',
    example: '626cf238b51596721c21289b',
  })
  @MongoIdValidationTransfrom({ toClassOnly: true })
  userId: Types.ObjectId;
}
