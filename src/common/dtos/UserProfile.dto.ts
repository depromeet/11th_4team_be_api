import { PickType } from '@nestjs/swagger';

import { User } from 'src/models/user.model';

export class UserProfileDto extends PickType(User, [
  '_id',
  'nickname',
  'profileUrl',
] as const) {}
