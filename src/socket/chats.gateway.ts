import { InjectModel } from '@nestjs/mongoose';
import { Logger, NotFoundException } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Chat } from '../models/chat.model';
import { Socket as SocketModel } from '../models/socket.model';
import { UserRepository } from 'src/repositories/user.repository';

@WebSocketGateway({
  namespace: 'chat',
})
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('Chat');
  constructor(
    private userRepository: UserRepository,
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(SocketModel.name)
    private readonly socketModel: Model<SocketModel>,
  ) {
    this.logger.log('constructor');
  }
  afterInit() {
    this.logger.log('init');
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const user = await this.socketModel.findOne({
      id: socket.id,
    });
    if (user) {
      socket.broadcast.emit('disconnect_user', user.nickname);
    }
    this.logger.log(`disconnected: ${socket.id} ${socket.nsp.name}`);
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected: ${socket.id} ${socket.nsp.name}`);
  }

  // 유저 찾기
  @SubscribeMessage('find_user')
  async handleNewUser(
    @MessageBody() nickname: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.userRepository.findOneByNickname({
      nickname,
    });

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    } else {
      await this.socketModel.create({
        id: socket.id,
        nickname,
      });
    }

    socket.broadcast.emit('user_connected', nickname);
    return nickname;
  }

  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.socketModel.findOne({ id: socket.id });

    await this.chatModel.create({
      user,
      chat: chat,
    });

    socket.broadcast.emit('new_chat', { chat, nickname: user.nickname });
  }
}
