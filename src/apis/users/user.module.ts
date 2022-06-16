import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Lightning, LightningSchema } from 'src/models/lightning.model';
import { OfficialNoti, OfficialNotiSchema } from 'src/models/officialNoti';
import { Report, ReportSchema } from 'src/models/report.model';
import { User, UserSchema } from 'src/models/user.model';
import { LightningRepository } from 'src/repositories/lightning.repository';
import { OfficialNotiRepository } from 'src/repositories/officialNoti.repository';
import { ReportRepository } from 'src/repositories/report.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { AlarmModule } from '../alarm/alarm.module';
import { RoomsModule } from '../rooms/rooms.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Report.name, schema: ReportSchema },
      { name: Lightning.name, schema: LightningSchema },
      { name: OfficialNoti.name, schema: OfficialNotiSchema },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => AlarmModule),
    forwardRef(() => RoomsModule),
  ],
  controllers: [UserController],
  providers: [
    UserRepository,
    UserService,
    ReportRepository,
    LightningRepository,
    OfficialNotiRepository,
  ],
  exports: [UserService, ReportRepository, UserRepository],
})
export class UserModule {}
