import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CATEGORY_TYPE } from 'src/common/consts/enum';
import { Room } from 'src/models/room.model';

export class ResFindRoomDto {
  constructor(room: Room) {
    this._id = room._id;
    this.category = room.category;
    this.name = room.name;
    this.radius = room.radius;
    this.lat = room.geometry.coordinates[0];
    this.lng = room.geometry.coordinates[1];
    this.userCount = room.userList.length;
    this.distance = room.distance;
  }
  @ApiProperty()
  _id: string;

  @ApiProperty({ description: '채팅방 이름' })
  name: string;

  @ApiProperty({ description: '반경정보' })
  radius: number;

  @ApiProperty({ enum: CATEGORY_TYPE, description: '카테고리정보' })
  category: CATEGORY_TYPE;

  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty({ description: '채팅방내 유저숫자' })
  userCount: number;
  @ApiProperty({ description: '거리정보' })
  distance: number;
}

// '_id',
// 'name',
// 'radius',
// 'category',

// export class UserShowDto {
//     // (1)
//     @Exclude() private readonly _id: number;
//     @Exclude() private readonly _firstName: string;
//     @Exclude() private readonly _lastName: string;
//     @Exclude() private readonly _orderDateTime: LocalDateTime;

//     constructor(user: User) {
//       this._id = user.id;
//       this._firstName = user.firstName;
//       this._lastName = user.lastName;
//       this._orderDateTime = user.orderDateTime.plusDays(1); // (2)
//     }

//     @ApiProperty()
//     @Expose() // (3)
//     get id(): number {
//       return this._id;
//     }

//     @ApiProperty()
//     @Expose()
//     get firstName(): string {
//       return this._firstName;
//     }

//     @ApiProperty()
//     @Expose()
//     get lastName(): string {
//       return this._lastName;
//     }

//     @ApiProperty()
//     @Expose()
//     get orderDateTime(): string {
//       return DateTimeUtil.toString(this._orderDateTime); // (4)
//     }
//   }
