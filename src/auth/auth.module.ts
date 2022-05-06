import { UserModule } from '../apis/users/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user.model';
import { Report, ReportSchema } from 'src/models/report.model';
import { Forbidden, ForbiddenSchema } from 'src/models/forbidden.model';
import { ReportRepository } from 'src/repositories/report.repository';
import { ForbiddenRepository } from 'src/repositories/forbidden.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      // { name: User.name, schema: UserSchema },
      // { name: Report.name, schema: ReportSchema },
      { name: Forbidden.name, schema: ForbiddenSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // console.log(configService.get<string>('JWT_SECRET'));
        return {
          secret: configService.get<string>('JWT_SECRET'),
        };
      },

      inject: [ConfigService],
    }),
    ConfigModule,
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, JwtStrategy, ForbiddenRepository],
  exports: [AuthService],
})
export class AuthModule {}
