import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Room } from 'src/models/room.model';

export class CreateRoomDto extends PickType(Room, [
  'name',
  'category',
  'radius',
] as const) {
  @ApiProperty({
    type: Number,
    title: '경도',
    example: '127',
  })
  @IsNumber()
  lng: number;
  @ApiProperty({
    type: Number,
    title: '위도',
    example: '37',
  })
  @IsNumber()
  lat: number;
}
