import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class IlikeResDto {
  @ApiProperty({
    example: true,
    description: '내가 좋아유 눌렀는지 최신값',
  })
  @IsBoolean()
  @Expose()
  ilike: boolean;
}
