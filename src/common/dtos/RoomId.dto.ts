import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types } from 'mongoose';

/**
 * mongoId 용 DTO
 */
export class RoomIdDto {
  constructor(roomId: string) {
    this.roomId = Types.ObjectId(roomId);
  }
  @ApiProperty({
    type: String,
    title: '룸 아이디',
    description: '몽고아이디 형식입니다. (홍익대학교 룸 예시 )',
    example: '62596e8c4e22b2180fe2a902',
  })
  @IsObjectId({ message: '룸 아이디 값이 몽고아이디 형식이 아닙니다.' })
  // transform 자동으로 해줌 . main.ts 참고
  @Transform(({ value }) => Types.ObjectId(value))
  roomId: Types.ObjectId;
}
