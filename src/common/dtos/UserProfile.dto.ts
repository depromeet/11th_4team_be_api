import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { Profile } from 'src/models/user.model';
import { Types } from 'mongoose';

export class UserProfileDto {
  constructor(user) {
    this._id = user._id;
    this.nickname = user.nickname;
    this.profile = user.profile;
  }
  @ApiProperty({ type: String, example: '624c24cae25c551b68a6645c' })
  @Expose()
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @ApiProperty({ type: String, example: 'nickname' })
  @Expose()
  nickname: string;

  @ApiProperty({ type: String, example: 'profile' })
  @Type(() => Profile)
  @Expose()
  profile: Profile;
}

export const UserProfileSelect = { _id: 1, nickname: 1, profile: 1 };
