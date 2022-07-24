import { ApiProperty } from '@nestjs/swagger';
export class CategoryIdDto {
  @ApiProperty({
    type: String,
    title: '카테고리 아이디',
    description: '카테고리 아이디',
    example: 'ALL',
  })
  id: string;
}
