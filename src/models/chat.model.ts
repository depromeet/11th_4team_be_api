import { IsBoolean, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { CHAT_TYPE } from 'src/common/consts/enum';
import { TransformObjectIdToString } from 'src/common/decorators/Expose.decorator';
import { Transform, Type } from 'class-transformer';
import { toKRTimeZone } from 'src/common/funcs/toKRTimezone';

const options: SchemaOptions = {
  collection: 'chat',
  timestamps: true,
};

@Schema(options)
export class Chat {
  @TransformObjectIdToString({ toClassOnly: true })
  @Type(() => Types.ObjectId)
  _id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'room' })
  @IsObjectId()
  room: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'user' })
  @IsObjectId()
  sender: Types.ObjectId;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  inside: boolean;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(CHAT_TYPE)
  type: CHAT_TYPE;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  // @Transform(({ value }) => toKRTimeZone(value), { toClassOnly: true })
  // @Expose()
  createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

// ChatSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });
