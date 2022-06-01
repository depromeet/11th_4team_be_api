import { Room } from 'src/models/room.model';
import { PickType } from '@nestjs/swagger';

export class RoomUserListDto extends PickType(Room, [
  'userList',
  'userCount',
] as const) {}
