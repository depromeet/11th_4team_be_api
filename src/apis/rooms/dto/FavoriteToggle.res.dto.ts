import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ResFavoriteToggleDto {
  @ApiProperty({
    example: true,
    description: '최신값의 투르폴스 데이타받아서 최신화 시키셔유',
  })
  @IsBoolean()
  iFavoritRoom: boolean;
}
