import { UserModule } from './../../apis/users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Chat, ChatSchema } from 'src/models/chat.model';
import { ChatsGateway } from '../chats.gateway';
import { SocketSchema, Socket as SocketModel } from 'src/models/socket.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: SocketModel.name, schema: SocketSchema },
    ]),
    UserModule,
  ],
  providers: [ChatsGateway],
})
export class ChatModule {}
 