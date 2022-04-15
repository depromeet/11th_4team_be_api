import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEnum, IsNumber, Max, Min } from 'class-validator';
import { CATEGORY_TYPE, FIND_ROOM_FILTER_TYPE } from 'src/common/consts/enum';
import { CoordinatesDto } from './coordinates.dto';

export class FindRoomDto extends PickType(CoordinatesDto, [
  'lat',
  'lng',
] as const) {
  @ApiProperty({ enum: FIND_ROOM_FILTER_TYPE })
  @IsEnum(FIND_ROOM_FILTER_TYPE)
  filter: FIND_ROOM_FILTER_TYPE;
}
