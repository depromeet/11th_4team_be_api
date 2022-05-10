import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';

import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';

const options: SchemaOptions = {
  collection: 'lightning',
  timestamps: true,
};

@Schema(options)
export class Lightning {
  @Prop({ type: Types.ObjectId })
  sendUser: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  receiveUser: Types.ObjectId;

  @Prop({
    type: Date,
    expires: 0,
  })
  @Expose()
  expireAt: Date;
}

export const LightningSchema = SchemaFactory.createForClass(Lightning);
