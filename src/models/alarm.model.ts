import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.model';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { CHAT_TYPE, EVENT_TYPE } from 'src/common/consts/enum';

const options: SchemaOptions = {
  collection: 'alarm',
  timestamps: true,
};

@Schema(options)
export class Chat extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'user' })
  @IsObjectId()
  receiver: Types.ObjectId;

  @Prop({
    default: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  watch: boolean;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  list: List;
}

@Schema()
export class List {
  @Prop({ required: true, type: Types.ObjectId, ref: 'user' })
  @IsObjectId()
  sender: Types.ObjectId;

  @Prop({ required: true })
  @IsString()
  @IsEnum(EVENT_TYPE)
  eventType: EVENT_TYPE;

  @Prop({
    default: Date.now(),
    type: Date,
    ref: 'user',
  })
  createdAt: Date;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  deepLink: string;
}

export const AlarmSchema = SchemaFactory.createForClass(Chat);
