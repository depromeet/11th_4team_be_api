import { Chat } from './chat.model';
import { Room } from './room.model';
import { IsNotEmpty, IsObject, IsString, IsArray } from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { User } from './user.model';
import { ApiProperty } from '@nestjs/swagger';
import { TransformObjectIdToString } from 'src/common/decorators/Expose.decorator';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { toKRTimeZone } from 'src/common/funcs/toKRTimezone';
import { UserProfileDto } from 'src/common/dtos/UserProfile.dto';

const options: SchemaOptions = {
  collection: 'question',
  timestamps: true,
};

//embeded comment
@Schema({ timestamps: true })
export class Comment {
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
  @IsObjectId()
  @Type(() => UserProfileDto)
  @Expose()
  user: User;
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
  @Type(() => Types.ObjectId)
  @Expose()
  _id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  @IsObjectId()
  @Exclude()
  room: Room;

  @ApiProperty({
    description: '질문의 내용 ( 채팅 메시지 복사본 )',
    type: String,
  })
  @Prop({ type: String, required: true })
  @IsString()
  content: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
  })
  @IsObjectId()
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
  comments: Comment[];

  @ApiProperty({
    type: [UserProfileDto],
    description: '좋아요 누른사람',
  })
  @Prop({
    default: [],
    type: [Types.ObjectId],
    ref: User.name,
  })
  @Type(() => UserProfileDto)
  @Expose()
  likes: User[];

  @ApiProperty({
    type: String,
    description: '한국시간으로 보정된 시간값',
  })
  @Transform(({ value }) => toKRTimeZone(value))
  @Expose()
  createdAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
