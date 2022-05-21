import { Chat } from './chat.model';
import { Room } from './room.model';
import { IsNotEmpty, IsObject, IsString, IsArray } from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsMongoId } from 'class-validator';
import { User } from './user.model';
import { ApiProperty } from '@nestjs/swagger';
import { TransformObjectIdToString } from 'src/common/decorators/Expose.decorator';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { toKRTimeZone } from 'src/common/funcs/toKRTimezone';
import { UserProfileDto } from 'src/common/dtos/UserProfile.dto';
import { truncate } from 'fs';

const options: SchemaOptions = {
  collection: 'question',
  timestamps: true,
};

//embeded comment
@Schema({ timestamps: true })
export class Comment {
  @ApiProperty({
    description: '댓글의 고유 아이디',
    type: String,
  })
  // 시리얼 라이제이션 할때 사용
  @TransformObjectIdToString({ toClassOnly: true })
  @Type(() => Types.ObjectId)
  @Expose()
  _id: Types.ObjectId;

  @ApiProperty({
    description: '댓글내용',
    type: String,
  })
  @Prop({ type: String, required: true })
  @IsString()
  @Expose()
  comment: string;

  @ApiProperty({
    description: '댓글 작성자',
    type: UserProfileDto,
  })
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: User.name,
  })
  @IsMongoId()
  @Type(() => UserProfileDto)
  @Expose()
  user: User;

  @ApiProperty({
    type: String,
    description: '한국시간으로 보정된 시간값 (댓글 단 시간)',
  })
  @Transform(({ value }) => toKRTimeZone(value), { toClassOnly: true })
  @Expose()
  createdAt: Date;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema(options)
export class Question {
  @ApiProperty({
    description: '유저의 고유아이디',
    type: String,
  })
  // 시리얼 라이제이션 할때 사용
  @TransformObjectIdToString({ toClassOnly: true })
  // @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  @Type(() => Types.ObjectId)
  @Expose()
  _id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  @IsMongoId()
  @Exclude()
  room: Room;

  @ApiProperty({
    description: '질문 작성자',
    type: UserProfileDto,
  })
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: User.name,
  })
  @IsMongoId()
  @Type(() => UserProfileDto)
  @Expose()
  user: User;

  @ApiProperty({
    description: '질문의 내용 ( 채팅 메시지 복사본 )',
    type: String,
  })
  @Prop({ type: String, required: true })
  @IsString()
  @Expose()
  content: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
  })
  @IsMongoId()
  @Exclude()
  chat: Chat;

  @ApiProperty({
    type: [Comment],
    description: '댓글 리스트',
  })
  @Prop({
    default: [],
    required: true,
    type: [CommentSchema],
  })
  @Type(() => Comment)
  @Expose()
  commentList: Comment[];

  @Prop({
    default: [],
    type: [Types.ObjectId],
    ref: User.name,
  })
  @Exclude({ toPlainOnly: true })
  @Transform((value) => value.obj.likes, { toClassOnly: true })
  @Expose({ toClassOnly: true })
  likes: Types.ObjectId[];

  @ApiProperty({
    type: String,
    description: '한국시간으로 보정된 시간값',
  })
  @Transform(({ value }) => toKRTimeZone(value), { toClassOnly: true })
  @Expose()
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  @Transform((value) => value.obj.myUserId, { toClassOnly: true })
  myUserId: Types.ObjectId;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
