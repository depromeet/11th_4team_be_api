import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';
import { CATEGORY_TYPE } from 'src/common/consts/enum';

import { UserProfileDto } from 'src/common/dtos/UserProfile.dto';
import { Room } from 'src/models/room.model';

export class ResFindOneRoomDto {
  constructor(room: Room, iFavoriteRoom: boolean) {
    this._id = room._id;
    this.category = room.category;
    this.name = room.name;
    this.radius = room.radius;
    this.lat = room.geometry.coordinates[0];
    this.lng = room.geometry.coordinates[1];
    this.iFavoriteRoom = iFavoriteRoom;
    this.userCount = room.userList.length;
  }
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  radius: number;

  @ApiProperty({ enum: CATEGORY_TYPE })
  category: CATEGORY_TYPE;

  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty({ type: [UserProfileDto], required: false })
  userList: UserProfileDto[];

  @ApiProperty({ description: '유저 숫자' })
  userCount: number;

  @ApiProperty({ description: '내가 즐겨찾기 했는지' })
  iFavoriteRoom: boolean;

  @ApiProperty({ description: '내가 들어가 있는지' })
  iJoin: boolean;
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
