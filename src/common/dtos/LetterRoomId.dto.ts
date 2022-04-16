import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';
/**
 * mongoId 용 DTO
 */
export class LetterRoomId {
  constructor(letterRoom: string) {
    this.letterRoom = Types.ObjectId(letterRoom);
  }

  @ApiProperty({
    type: String,
    title: '쪽지방 아이디',
    description: '몽고아이디 형식입니다.',
    // example: '624c24cae25c551b68a6645c',
  })
  @IsNotEmpty()
  @IsObjectId({ message: '쪽지방 아이디가 몽고아이디 형식이 아닙니다.' })
  @Transform(({ value }) => Types.ObjectId(value))
  letterRoom: Types.ObjectId;
}
