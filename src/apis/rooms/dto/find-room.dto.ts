import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class FindRoomDto {
  @ApiProperty({ example: '127', description: '경도입니다 세로선!' })
  @IsNumber()
  @Min(120)
  @Max(135)
  lng: number;

  @ApiProperty({ example: '37', description: '위도입니다 가로선' })
  @IsNumber()
  @Min(30)
  @Max(45)
  lat: number;
}
