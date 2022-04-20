import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { User } from './user.model';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IsArray } from 'class-validator';
import { Letter } from './letter.model';
import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from 'src/common/dtos/UserProfile.dto';

const options: SchemaOptions = {
  collection: 'letterroom',
  timestamps: true,
};

@Schema(options)
export class LetterRoom extends Document {
  @ApiProperty({
    type: [UserProfileDto],
    description: '채팅방 ( 참여중인 사람 )',
  })
  @Prop({
    required: true,
    type: [MongooseSchema.Types.ObjectId],
    ref: User.name,
  })
  @IsArray()
  joinUserList: User[];

  // 쪽지방 목록 보여줄때 신경쓰는거임
  @ApiProperty({
    type: [UserProfileDto],
    description: '채팅방 ( 이미 나간사람 )',
  })
  @Prop({
    required: true,
    type: [MongooseSchema.Types.ObjectId],
    ref: User.name,
  })
  @IsArray()
  leftUserList: User[];

  // 가상 필드 타입 용 쪽지모음 선언
  @ApiProperty({
    type: [Letter],
    description: '쪽지 모음',
  })
  readonly letters: Letter[];
  updatedAt: Date;
}

export const _LetterRoomSchema = SchemaFactory.createForClass(LetterRoom);

_LetterRoomSchema.virtual('letters', {
  ref: Letter.name,
  localField: '_id',
  foreignField: 'letterRoom',
});

_LetterRoomSchema.set('toObject', { virtuals: true });
_LetterRoomSchema.set('toJSON', { virtuals: true });

export const LetterRoomSchema = _LetterRoomSchema;
