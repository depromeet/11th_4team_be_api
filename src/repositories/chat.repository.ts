import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Chat } from 'src/models/chat.model';
import { RoomIdDto } from 'src/common/dtos/RoomId.dto';
import { ChatIdDto } from 'src/common/dtos/ChatId.dto';
import { UserProfileSelect } from 'src/common/dtos/UserProfile.dto';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(Chat.name)
    private readonly chatModel: Model<Chat>,
  ) {}

  // 99개가 최대이므로 100개까지만 가져옴
  async getNotReadMessagesbyCursor(
    roomIdDto: RoomIdDto,
    chatIdDto: ChatIdDto,
  ): Promise<Chat[]> {
    const chats = this.chatModel
      .find({
        room: roomIdDto.roomId,
        _id: { $gte: chatIdDto.chatId },
      })
      .populate({
        path: 'sender',
        select: UserProfileSelect,
      })
      .sort({ createdAt: -1 })
      .limit(101)
      .lean<Chat[]>();
    return chats;
  }

  async getNotReadMessagesLatest100(roomIdDto: RoomIdDto): Promise<Chat[]> {
    const chats = this.chatModel
      .find({
        room: roomIdDto.roomId,
      })
      .populate({
        path: 'sender',
        select: UserProfileSelect,
      })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean<Chat[]>();
    return chats;
  }
}
