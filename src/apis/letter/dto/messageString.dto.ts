import { PickType } from '@nestjs/swagger';
import { Letter } from 'src/models/letter.model';

export class MessageStringDto extends PickType(Letter, ['message'] as const) {}
