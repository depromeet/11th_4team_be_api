import { ApiProperty } from '@nestjs/swagger';
import {
  IsISO8601,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { Types } from 'mongoose';
import { Transform } from 'class-transformer';
import { MongoIdValidationTransfrom } from '../decorators/MongoIdValidationTransfrom.decorator';
/**
 * mongoId 용 DTO
 */
export class PageLastIdDto {
  // constructor(lastId: string | Types.ObjectId) {
  //   if (lastId instanceof Types.ObjectId) {
  //     this.lastId = lastId;
  //   } else {
  //     this.lastId = new Types.ObjectId(lastId);
  //   }
  // }

  @ApiProperty({
    type: String,
    title: '마지막 콘텐트의 아이디 _id',
    description: 'lastId (커서) 방식으로 페이지 네이션을 합니다.',
    required: false,
  })
  @IsOptional()
  @MongoIdValidationTransfrom({ toClassOnly: true })
  lastId: Types.ObjectId;
}
