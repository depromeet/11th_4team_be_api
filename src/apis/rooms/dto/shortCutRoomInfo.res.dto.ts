import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CATEGORY_TYPE } from 'src/common/consts/enum';
import { Room } from 'src/models/room.model';

export class ResShortCutRoomDto {
  @ApiProperty()
  _id: string;

  @ApiProperty({ description: '채팅방 이름' })
  name: string;

  @ApiProperty({ enum: CATEGORY_TYPE, description: '카테고리정보' })
  category: CATEGORY_TYPE;

  @ApiProperty({ description: '채팅방내 유저숫자' })
  userCount: number;
}
