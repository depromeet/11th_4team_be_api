import { ApiProperty, PickType } from '@nestjs/swagger';
import { string } from 'joi';
import { Types } from 'mongoose';

import { User } from 'src/models/user.model';

export class UserProfileDto extends PickType(User, [
  'nickname',
  'profileUrl',
] as const) {
  @ApiProperty({ type: string, example: '624c24cae25c551b68a6645c' })
  _id: Types.ObjectId;
}
