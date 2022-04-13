import { IsNumber } from 'class-validator';

export class FindRoomDto {
  @IsNumber()
  lng: number;
  @IsNumber()
  lat: number;
}
