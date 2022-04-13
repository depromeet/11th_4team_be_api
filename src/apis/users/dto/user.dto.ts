import { PickType } from '@nestjs/swagger';
import { User } from 'src/models/user.model';

export class PhoneNumberDto extends PickType(User, ['phoneNumber'] as const) {}
export class NicknameDto extends PickType(User, ['nickname'] as const) {}

export class UpdateProfileDto extends PickType(User, [
  'nickname',
  'profileUrl',
  'status',
] as const) {}
