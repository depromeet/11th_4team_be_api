import { PickType } from '@nestjs/swagger';
import { User } from 'src/models/user.model';

export class FlagInfoDto extends PickType(User, ['flagInfo'] as const) {}
