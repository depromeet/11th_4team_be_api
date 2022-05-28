import { ApiProperty, PickType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserProfileDto } from 'src/common/dtos/UserProfile.dto';
import { Room } from 'src/models/room.model';

export class ResFindRoomDto extends PickType(Room, [
  '_id',
  'name',
  'category',
  'radius',
  'userList',
  'geometry',
  'userCount',
] as const) {
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  userList: UserProfileDto[];

  @ApiProperty({ description: '내가 즐겨찾기 했는지', type: Boolean })
  @Expose()
  iFavorite: boolean;

  @ApiProperty({ description: '내가 들어가 있는지', type: Boolean })
  @Expose()
  iJoin: boolean;

  @ApiProperty({ description: '위도 가로선', type: Number })
  @Expose()
  get lat(): number {
    return this.geometry.coordinates[1];
  }

  @ApiProperty({ description: '경도 세로선', type: Number })
  @Expose()
  get lng(): number {
    return this.geometry.coordinates[0];
  }
}
// console.log(plainToClass(User, fromPlainUser, { excludeExtraneousValues: true }));
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
