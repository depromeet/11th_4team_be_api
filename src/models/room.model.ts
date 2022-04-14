import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import {
  Prop,
  raw,
  Schema,
  SchemaFactory,
  SchemaOptions,
} from '@nestjs/mongoose';
import { CATEGORY_TYPE } from 'src/common/consts/enum';
import { User } from './user.model';
import * as mongoose from 'mongoose';
import { number } from 'joi';

const options: SchemaOptions = {
  // rooms default 로 s 붙여지는데 디폴트로가는게 좋을것 같아요! (이찬진)
  collection: 'rooms',
  timestamps: true,
};

// @Schema()
// export class GeoPoint extends Document {
//   // @Prop({ required: true })
//   // coordinates: number[];
// }

@Schema({ useNestedStrict: true, _id: false })
export class Geometry {
  @IsArray()
  @Prop({ type: Array, required: true })
  coordinates: number[];
  @IsString()
  @Prop({ type: String })
  type: string;
}

@Schema(options)
export class Room {
  @Prop({
    required: true,
  })
  @ApiProperty({
    type: String,
    title: '채팅방 이름',
    description: '채팅방의 이름입니다',
    example: '홍익대학교',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({
    required: true,
  })
  @ApiProperty({
    enum: CATEGORY_TYPE,
    title: '카테고리',
    description:
      '카테고리를 나타내는 상태입니다. 기획안 따라 지속적으로 추가할 예정입니다.',
    example: '대학교',
  })
  @IsNotEmpty()
  @IsEnum(CATEGORY_TYPE)
  category: CATEGORY_TYPE;

  @Prop({ required: true })
  @ApiProperty({
    type: Number,
    title: '반경정보',
    description: '미터 단위의 반경정보입니다',
    example: 2000,
  })
  @IsNotEmpty()
  @IsNumber()
  radius: number;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  })
  @IsNotEmpty()
  @IsArray()
  userList: User[];

  @ApiProperty({
    type: Geometry,
    title: 'current_location',
    example: '{"type":"Point","coordinates":[36.612849, 126.229883]}',
  })
  @IsObject()
  @Prop({
    type: Geometry,
    index: '2dsphere',
  })
  geometry: Geometry;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
