import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LeftRoomResultResDto {
  @ApiProperty({
    example: true,
    description: '방떠난거 성공여부',
  })
  @Expose()
  leftSuccess: boolean;
}
