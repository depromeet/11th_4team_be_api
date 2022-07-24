import { ApiProperty } from '@nestjs/swagger';
import { Prop } from '@nestjs/mongoose';

import { IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';


export class CategoryDto {
  @ApiProperty({
    description: '카테고리 아이디',
    type: String,
  })
  @IsString()
  @Expose()
  id: string;

  @ApiProperty({
    description: '카테고리 이름',
    type: String,
  })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({
    description: '카테고리 이미지 경로',
    type: String,
  })
  @IsString()
  @Expose()
  imageUrl: string;

  @ApiProperty({
    description: '카테고리 우선순위(낮을수록 우선순위 높음)',
    type: Number,
  })
  @IsNumber()
  @Expose()
  priority: Number;
}
