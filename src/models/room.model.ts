import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CATEGORY_TYPE } from 'src/common/consts/enum';
import { User } from './user.model';
import * as mongoose from 'mongoose';

const options: SchemaOptions = {
  id: false,
  collection: 'room',
  timestamps: true,
};

@Schema()
export class GeoPoint extends Document {
  @Prop({ required: true })
  coordinates: number[];
}

@Schema()
export class Geometry extends Document {
  @Prop({ type: GeoPoint, index: '2dsphere' })
  geometry: GeoPoint;

  // @Prop()
  // type: string;
}

@Schema(options)
export class Room extends Document {
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
    example: '{"type":"Point","coordinates":[28.612849, 77.229883]}',
  })
  @Prop({ required: true, type: Geometry })
  @IsNotEmpty()
  @IsObject()
  geometry: Geometry;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
