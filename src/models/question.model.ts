import { Chat } from './chat.model';
import { Room } from './room.model';
import { IsNotEmpty, IsObject, IsString, IsArray } from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';
import * as mongoose from 'mongoose';
import { string } from 'joi';
import { User } from './user.model';

const options: SchemaOptions = {
  collection: 'question',
  timestamps: true,
};

@Schema(options)
export class Question extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'room' })
  @IsObjectId()
  room: Room;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'chatting',
  })
  @IsObjectId()
  chat: Chat;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  commentList: CommentList[];
}

class CommentList extends Document {
  @Prop({ type: String, required: true })
  @IsString()
  message: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  })
  user: User;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
