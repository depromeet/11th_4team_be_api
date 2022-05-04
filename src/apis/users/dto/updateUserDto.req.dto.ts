import { PickType } from '@nestjs/swagger';
import { User } from 'src/models/user.model';
export class UpdateProfileReqDto extends PickType(User, [
  'nickname',
  'profile',
] as const) {}
