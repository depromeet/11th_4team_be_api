import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class CoordinatesDto {
  @ApiProperty({ example: '127', description: '경도입니다 세로선!' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;

  @ApiProperty({ example: '37', description: '위도입니다 가로선' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;
}
