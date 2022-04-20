import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { User } from './user.model';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

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

  //보낸 사람
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  @IsObjectId()
  sender: User;

  // 보일 수 있는 유저.. 채팅방 나가면 없애버리는거임
  @Prop({ required: true, type: [MongooseSchema.Types.ObjectId], ref: 'User' })
  @IsArray()
  visibleUser: User[];

  // 받은 사람이 읽었냐?
  @Prop({ required: true, type: [MongooseSchema.Types.ObjectId], ref: 'User' })
  @IsBoolean()
  notWatchUser: User[];

  @ApiProperty({
    type: String,
    description: '쪽지 내용',
    example: '안뇽?!',
  })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  createdAt: Date;
}

export const LetterSchema = SchemaFactory.createForClass(Letter);
