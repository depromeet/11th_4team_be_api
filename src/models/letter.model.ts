import { IsNotEmpty, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.model';
import { IsObjectId } from 'class-validator-mongo-object-id';
import * as mongoose from 'mongoose';

const options: SchemaOptions = {
  collection: 'letter',
  timestamps: true,
};

@Schema(options)
export class Letter extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  @IsObjectId()
  sender: User;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  @IsObjectId()
  receiver: User;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}

export const LetterSchema = SchemaFactory.createForClass(Letter);
