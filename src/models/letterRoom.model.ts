import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { User } from './user.model';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IsArray } from 'class-validator';

const options: SchemaOptions = {
  collection: 'letterroom',
  timestamps: true,
};

@Schema(options)
export class LetterRoom extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'user' })
  @IsArray()
  joinUserList: User[];

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'user' })
  @IsArray()
  leftUserList: User[];
}

export const LetterRoomSchema = SchemaFactory.createForClass(LetterRoom);
