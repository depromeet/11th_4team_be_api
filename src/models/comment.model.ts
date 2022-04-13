import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { Document, ObjectId, SchemaOptions, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

const options: SchemaOptions = {
  collection: 'comment',
  timestamps: true,
};

@Schema(options)
export class Comment extends Document {
  @ApiProperty({
    description: '작성한 유저 id',
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'user',
  })
  @IsNotEmpty()
  author: Types.ObjectId;

  @ApiProperty({
    description: '댓글 컨텐츠',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  contents: string;

  @ApiProperty({ example: 1, description: '상위댓글 ID' })
  @Prop({ description: 'PARENT_ID' })
  @IsNumber()
  @IsNotEmpty()
  parentId: string;

  @ApiProperty({
    description: '좋아요 수',
  })
  @Prop({
    default: 0,
  })
  @IsPositive()
  likeCount: number;

  @ApiProperty({
    description: '삭제 여부',
  })
  @Prop({ description: 'DELETE_YN' })
  isDelete: boolean;

  @ApiProperty({
    description: '작성 대상 (채팅글, 질문글) - 현재는 질문만',
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'question',
  })
  @IsNotEmpty()
  info: Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
