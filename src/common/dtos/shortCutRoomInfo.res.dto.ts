import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { CATEGORY_TYPE } from 'src/common/consts/enum';
import { Room } from 'src/models/room.model';
import { TransformObjectIdToString } from '../decorators/Expose.decorator';

export class ResShortCutRoomDto {
  @ApiProperty({
    description: '방의 고유 아이디',
    type: String,
  })
  @Transform((value) => value.obj._id, { toClassOnly: true })
  @TransformObjectIdToString({ toClassOnly: true })
  @Expose()
  _id: string;

  @ApiProperty({ description: '채팅방 이름' })
  @Expose()
  name: string;

  @ApiProperty({ enum: CATEGORY_TYPE, description: '카테고리정보' })
  @Expose()
  category: CATEGORY_TYPE;

  @ApiProperty({ description: '채팅방내 유저숫자' })
  @Expose()
  userCount: number;
}
