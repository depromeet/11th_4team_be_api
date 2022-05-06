import { Room } from 'src/models/room.model';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ResFindOneRoomDto extends PickType(Room, [
  '_id',
  'name',
  'category',
  'radius',
  'userList',
  'geometry',
  'userCount',
] as const) {
  @ApiProperty({ description: '내가 즐겨찾기 했는지', type: Boolean })
  @Expose()
  iFavorite: boolean;

  @ApiProperty({ description: '내가 들어가 있는지', type: Boolean })
  @Expose()
  iJoin: boolean;

  @ApiProperty({ description: '위도 가로선', type: Number })
  @Expose()
  get lat(): number {
    return this.geometry.coordinates[0];
  }

  @ApiProperty({ description: '경도 세로선', type: Number })
  @Expose()
  get lng(): number {
    return this.geometry.coordinates[1];
  }

  @ApiProperty({ description: '내가 채팅방 알림 켰는지여부' })
  @Expose()
  iAlarm: boolean;

  @ApiProperty({ description: '유저명수' })
  @Transform((value) => value.obj.userList.length, { toPlainOnly: true })
  @Expose()
  userCount: number;
  // get userCount(): number {
  //   return 0;
  // }
}
// export class ResFindOneRoomDto {
//   constructor(room: Room, iFavoriteRoom: boolean, iAlarm: boolean) {
//     this._id = room._id;
//     this.category = room.category;
//     this.name = room.name;
//     this.radius = room.radius;
//     this.lat = room.geometry.coordinates[0];
//     this.lng = room.geometry.coordinates[1];
//     this.iFavoriteRoom = iFavoriteRoom;
//     this.iAlarm = iAlarm;
//     this.userCount = room.userList.length;
//     this.userList = room.userList;
//   }
//   @ApiProperty()
//   _id: string;

//   @ApiProperty()
//   name: string;

//   @ApiProperty()
//   radius: number;

//   @ApiProperty({ enum: CATEGORY_TYPE })
//   category: CATEGORY_TYPE;

//   @ApiProperty()
//   lat: number;

//   @ApiProperty()
//   lng: number;

//   @ApiProperty({ type: [UserProfileDto], required: false })
//   userList: UserProfileDto[];

//   @ApiProperty({ description: '유저 숫자' })
//   userCount: number;

//   @ApiProperty({ description: '내가 즐겨찾기 했는지' })
//   iFavoriteRoom: boolean;

//   @ApiProperty({ description: '내가 들어가 있는지' })
//   iJoin: boolean;

//   @ApiProperty({ description: '내가 채팅방 알림 켰는지여부' })
//   iAlarm: boolean;
// }
