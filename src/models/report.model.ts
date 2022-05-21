import { IsBoolean, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsMongoId } from 'class-validator';
import { User } from './user.model';

const options: SchemaOptions = {
  collection: 'report',
  timestamps: true,
};

@Schema(options)
export class Report extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'user' })
  @IsMongoId()
  reporter: User;

  @Prop({ required: true, type: Types.ObjectId, ref: 'user' })
  @IsMongoId()
  reportedUser: User;
}

export const ReportSchema = SchemaFactory.createForClass(Report);

// ttl to index 30min
ReportSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1800 });
