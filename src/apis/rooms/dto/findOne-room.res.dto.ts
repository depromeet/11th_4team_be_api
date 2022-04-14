import { ApiProperty, PickType } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CATEGORY_TYPE } from 'src/common/consts/enum';

import { UserProfileDto } from 'src/common/dtos/UserProfile.dto';
import { Room } from 'src/models/room.model';

export class ResFindOneRoomDto {
  constructor(room: Room, isUserFavoriteRoom: boolean) {
    this._id = room._id;
    this.category = room.category;
    this.name = room.name;
    this.radius = room.radius;
    this.lat = room.geometry.coordinates[0];
    this.lng = room.geometry.coordinates[1];
    this.isUserFavoriteRoom = isUserFavoriteRoom;
    this.userList = room.userList as UserProfileDto[];
  }
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  name: string;

  @ApiProperty()
  radius: number;

  @ApiProperty()
  category: CATEGORY_TYPE;

  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty({ type: UserProfileDto })
  userList: UserProfileDto[];

  @ApiProperty()
  isUserFavoriteRoom: boolean;
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
