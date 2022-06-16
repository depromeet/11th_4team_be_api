import { IsBoolean } from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { TransformObjectIdToString } from 'src/common/decorators/Expose.decorator';
import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { toKRTimeZone } from 'src/common/funcs/toKRTimezone';

const options: SchemaOptions = {
  collection: 'officialNoti',
  timestamps: true,
};

@Schema(options)
export class OfficialNoti {
  @ApiProperty({
    description: '개별 공지사항의 고유 아이디',
    type: String,
  })
  // 시리얼 라이제이션 할때 사용
  @TransformObjectIdToString({ toClassOnly: true })
  @Type(() => Types.ObjectId)
  @Expose()
  _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    description: '작성자',
  })
  @Prop({
    default: '',
    type: String,
  })
  @Expose()
  nickname: string;

  @ApiProperty({
    type: String,
    description: '글내용',
  })
  @Prop({
    type: String,
  })
  @Expose()
  content: string;

  @ApiProperty({
    type: String,
    nullable: true,
    default: null,
    description: '뎁스 넘어갈수있는 링크',
  })
  @Prop({
    default: null,
    type: String,
  })
  @Expose()
  link: string;

  @ApiProperty({
    type: String,
    description: '한국시간으로 보정된 시간값',
  })
  @Transform(({ value }) => toKRTimeZone(value), { toClassOnly: true })
  @Expose()
  createdAt: Date;
}

export const OfficialNotiSchema = SchemaFactory.createForClass(OfficialNoti);
// 한달 간격 사라짐
