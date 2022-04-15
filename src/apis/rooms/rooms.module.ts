import { forwardRef, Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from 'src/models/room.model';
import { RoomRepository } from 'src/repositories/room.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { User, UserSchema } from 'src/models/user.model';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../users/user.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: User.name, schema: UserSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomRepository],
  exports: [RoomsService, RoomRepository],
})
export class RoomsModule {}
