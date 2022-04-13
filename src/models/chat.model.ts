import { Socket } from 'socket.io';
import { IsBoolean, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';
import * as mongoose from 'mongoose';
import { CHAT_TYPE } from 'src/common/consts/enum';
import { Room } from './room.model';

const options: SchemaOptions = {
  collection: 'chat',
  timestamps: true,
};

@Schema(options)
export class Chat extends Document {
  @Prop({
    type: {
      _id: { type: Types.ObjectId, required: true, ref: 'sockets' },
      id: { type: String },
      username: { type: String, required: true },
    },
  })
  @IsNotEmpty()
  sender: Socket;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'room' })
  @IsObjectId()
  room: Room;

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
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
