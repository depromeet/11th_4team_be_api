import { IsBoolean, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { User } from './user.model';

const options: SchemaOptions = {
  collection: 'forbidden',
  timestamps: true,
};

@Schema(options)
export class Forbidden extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'user' })
  user: User;

  createdAt: Date;
}

export const ForbiddenSchema = SchemaFactory.createForClass(Forbidden);

// ttl to index 30min
ForbiddenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1800 });
