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
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(CATEGORY_TYPE)
  category: CATEGORY_TYPE;

  @Prop({ required: true })
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
    type: String,
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
