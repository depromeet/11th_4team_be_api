import { IsBoolean, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { CHAT_TYPE } from 'src/common/consts/enum';
import { TransformObjectIdToString } from 'src/common/decorators/Expose.decorator';
import { Expose, Transform, Type } from 'class-transformer';
import { toKRTimeZone } from 'src/common/funcs/toKRTimezone';
import { User } from './user.model';
import { UserProfileDto } from 'src/common/dtos/UserProfile.dto';
import { ApiProperty } from '@nestjs/swagger';

const options: SchemaOptions = {
  collection: 'chat',
  timestamps: true,
};

@Schema(options)
export class Chat {
  @TransformObjectIdToString({ toClassOnly: true })
  @Type(() => Types.ObjectId)
  @Expose()
  _id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'room' })
  @IsObjectId()
  room: Types.ObjectId;

  @ApiProperty({
    description: '채팅 작성자',
    type: UserProfileDto,
  })
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  @Type(() => UserProfileDto)
  @IsObjectId()
  @Expose()
  sender: User;

  @ApiProperty({
    description: '채팅 칠시에 안에 있는지 없는지 정보',
    type: Boolean,
  })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  inside: boolean;

  @ApiProperty({
    description: '1 일시 질문 0 일시 기본',
    enum: CHAT_TYPE,
  })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(CHAT_TYPE)
  @Expose()
  type: CHAT_TYPE;

  @ApiProperty({
    description: '1 일시 질문 0 일시 기본',
    type: String,
  })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  message: string;

  @ApiProperty({
    description: '한국시간으로 보정된 시간값',
    type: String,
  })
  @Transform(({ value }) => toKRTimeZone(value), { toClassOnly: true })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: '내가 차단했는지 정보',
    type: Boolean,
  })
  @Expose()
  iBlock: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

// ChatSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });
