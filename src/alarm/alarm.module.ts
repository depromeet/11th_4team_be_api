import { Module } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { AlarmController } from './alarm.controller';

@Module({
  providers: [AlarmService],
  controllers: [AlarmController]
})
export class AlarmModule {}
