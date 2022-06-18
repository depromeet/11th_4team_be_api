import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

import { CATEGORY_TYPE } from 'src/common/consts/enum';
import { TransformObjectIdToString } from 'src/common/decorators/Expose.decorator';
import { toKRTimeZone } from 'src/common/funcs/toKRTimezone';
import { Chat } from 'src/models/chat.model';
import { Geometry } from 'src/models/room.model';

export class MyRoomInfoDto {
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

  //추가됨
  @ApiProperty({
    description: '아직 읽지 않은 채팅 숫자 0이면 표시안하시면 됩니다.',
    default: 0,
  })
  @Expose()
  notReadChatCount: number;
  // 추가됨
  @ApiProperty({
    description: '최신 채팅 정보 채팅 dto로 하나 또는 null',
    type: Chat,
    nullable: true,
    default: null,
  })
  @Type(() => Chat)
  @Expose()
  lastChat: Chat | null;

  @Type(() => Geometry)
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  geometry: Geometry;

  @ApiProperty({ description: '위도 가로선', type: Number })
  @Expose()
  get lat(): number {
    return this.geometry.coordinates[1];
  }

  @ApiProperty({ description: '경도 세로선', type: Number })
  @Expose()
  get lng(): number {
    return this.geometry.coordinates[0];
  }
}
