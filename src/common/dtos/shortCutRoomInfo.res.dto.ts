import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { CATEGORY_TYPE } from 'src/common/consts/enum';
import { Geometry, Room } from 'src/models/room.model';
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

  @Type(() => Geometry)
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  geometry: Geometry;

  @ApiProperty({ description: '위도 가로선', type: Number })
  @Expose()
  get lat(): number {
    return this.geometry.coordinates[0];
  }

  @ApiProperty({ description: '경도 세로선', type: Number })
  @Expose()
  get lng(): number {
    return this.geometry.coordinates[1];
  }
}
