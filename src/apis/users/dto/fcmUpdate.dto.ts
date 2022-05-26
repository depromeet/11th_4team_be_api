import { ApiProperty, PickType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/models/user.model';

export class FCMUpdateDto extends PickType(User, ['FCMToken'] as const) {}
