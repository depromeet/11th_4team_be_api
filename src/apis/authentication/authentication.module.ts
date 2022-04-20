import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { Profile, ProfileSchema, User, UserSchema } from 'src/models/user.model';
import { UserRepository } from 'src/repositories/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Profile.name, schema: ProfileSchema }
    ]),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, UserRepository],
  exports: [AuthenticationService],
})
export class AuthenticationModule { }
