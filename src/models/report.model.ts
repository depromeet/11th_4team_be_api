import { IsBoolean, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { User } from './user.model';

const options: SchemaOptions = {
  collection: 'report',
  timestamps: true,
};

@Schema(options)
export class Report extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'user' })
  @IsObjectId()
  reporter: User;

  @Prop({ required: true, type: Types.ObjectId, ref: 'user' })
  @IsObjectId()
  reportedUser: User;
}

export const ReportSchema = SchemaFactory.createForClass(Report);

// ttl to index 30min
ReportSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1800 });
