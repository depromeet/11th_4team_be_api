import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { Profile, User } from 'src/models/user.model';
import { Types } from 'mongoose';
import { TransformObjectIdToString } from '../decorators/Expose.decorator';
import { STATUS_TYPE } from '../consts/enum';

export class UserProfileDto {
  constructor(user: User) {
    if (user) {
      this._id = user._id;
      this.nickname = user.nickname;
      this.profile = user.profile;
      this.level = user.level;
      this.status = user.status;
    }
  }
  @ApiProperty({ type: String, example: '626cf238b51596721c21289b' })
  @Expose()
  @Transform((value) => value.obj._id, { toClassOnly: true })
  @TransformObjectIdToString({ toPlainOnly: true })
  _id: Types.ObjectId;

  @ApiProperty({ type: String, example: 'nickname' })
  @Expose()
  nickname: string;

  @ApiProperty({ type: String, example: 'profile' })
  @Type(() => Profile)
  @Expose()
  profile: Profile;

  @ApiProperty({
    type: Number,
    description: '유저의 확성기 레벨',
  })
  @Expose()
  level: number;

  @ApiProperty({
    enum: STATUS_TYPE,
    description:
      '유저의 상태 ( 노말 : 정상 , 정지 : forbidden , 탈퇴 : signOut',
  })
  @Expose()
  status: string;
}

export const UserProfileSelect = {
  _id: 1,
  nickname: 1,
  profile: 1,
  level: 1,
  status: 1,
};
