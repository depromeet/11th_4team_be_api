import { PickType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Room } from 'src/models/room.model';

export class CreateRoomDto extends PickType(Room, [
  'name',
  'category',
  'radius',
] as const) {
  @IsNumber()
  lng: number;
  @IsNumber()
  lat: number;
}
