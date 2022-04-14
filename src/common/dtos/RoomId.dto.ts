import { ApiProperty } from '@nestjs/swagger';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types } from 'mongoose';

/**
 * mongoId 용 DTO
 */
export class RoomIdDto {
  @ApiProperty({
    type: String,
    title: '룸 아이디',
    description: '몽고아이디 형식입니다. (홍익대학교 룸 예시 )',
    example: '6257b0c1c5bcdfb07c129fd9',
  })
  @IsObjectId({ message: '룸 아이디 값이 몽고아이디 형식이 아닙니다.' })
  // transform 자동으로 해줌 . main.ts 참고
  roomId: Types.ObjectId;
}
