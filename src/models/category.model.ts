import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';

import { IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

const options: SchemaOptions = {
  collection: 'category',
  timestamps: true,
};

@Schema(options)
export class Category {
  @ApiProperty({
    description: '카테고리 아이디',
    type: String,
  })
  @Prop({ type: String, required: true })
  @IsString()
  @Expose()
  id: string;

  @ApiProperty({
    description: '카테고리 이름',
    type: String,
  })
  @Prop({ type: String, required: true })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({
    description: '카테고리 이미지 경로',
    type: String,
  })
  @Prop({ type: String, required: true })
  @IsString()
  @Expose()
  imageUrl: string;

  @ApiProperty({
    description: '카테고리 우선순위',
    type: Number,
  })
  @Prop({ type: Number, required: true })
  @IsNumber()
  @Expose()
  priority: Number;

  @Prop({ type: Number, required: true, default: '' })
  @IsNumber()
  @Expose()
  subtitle: Number;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
