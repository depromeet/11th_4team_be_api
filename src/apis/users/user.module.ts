import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Lightning, LightningSchema } from 'src/models/lightning.model';
import { Report, ReportSchema } from 'src/models/report.model';
import { User, UserSchema } from 'src/models/user.model';
import { LightningRepository } from 'src/repositories/lightning.repository';
import { ReportRepository } from 'src/repositories/report.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { AlarmModule } from '../alarm/alarm.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Report.name, schema: ReportSchema },
      { name: Lightning.name, schema: LightningSchema },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => AlarmModule),
  ],
  controllers: [UserController],
  providers: [
    UserRepository,
    UserService,
    ReportRepository,
    LightningRepository,
  ],
  exports: [UserService, ReportRepository, UserRepository],
})
export class UserModule {}
