import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Report, ReportSchema } from 'src/models/report.model';
import { User, UserSchema } from 'src/models/user.model';
import { ReportRepository } from 'src/repositories/report.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Report.name, schema: ReportSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService, ReportRepository],
  exports: [UserService, ReportRepository, UserRepository],
})
export class UserModule {}
