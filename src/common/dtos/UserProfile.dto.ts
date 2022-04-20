import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class UserProfileDto {
  constructor(user) {
    this._id = user._id;
    this.nickname = user.nickname;
    this.profileUrl = user.profileUrl;
  }
  @ApiProperty({ type: String, example: '624c24cae25c551b68a6645c' })
  @Expose()
  @Transform(({ value }) => String(value))
  _id?: string;

  @ApiProperty({ type: String, example: 'nickname' })
  @Expose()
  nickname: string;

  @ApiProperty({ type: String, example: 'profile' })
  @Expose()
  profileUrl: string;
}

export const UserProfileSelect = { _id: 1, nickname: 1, profileUrl: 1 };
