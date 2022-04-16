import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { User } from './user.model';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

const options: SchemaOptions = {
  collection: 'letter',
  timestamps: true,
};

@Schema(options)
export class Letter extends Document {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'LetterRoom',
  })
  @IsObjectId()
  letterRoom: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  @IsObjectId()
  sender: User;

  @Prop({ required: true, type: Boolean, default: true })
  @IsBoolean()
  visible: boolean;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}

export const LetterSchema = SchemaFactory.createForClass(Letter);
