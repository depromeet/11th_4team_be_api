import { Module } from '@nestjs/common';
import { LetterService } from './letter.service';
import { LetterController } from './letter.controller';

@Module({
  providers: [LetterService],
  controllers: [LetterController],
})
export class LetterModule {}
