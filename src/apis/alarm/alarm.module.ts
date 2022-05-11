import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Alarm, AlarmSchema } from 'src/models/alarm.model';
import { AlarmRepository } from 'src/repositories/alarm.repository';
import { UserModule } from '../users/user.module';
import { AlarmService } from './alarm.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Alarm.name, schema: AlarmSchema }]),
    forwardRef(() => UserModule),
  ],
  providers: [AlarmService, AlarmRepository],
  exports: [AlarmService, AlarmRepository],
})
export class AlarmModule {}
