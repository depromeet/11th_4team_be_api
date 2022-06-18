import { Injectable } from '@nestjs/common';
import { ChatIdDto } from 'src/common/dtos/ChatId.dto';
import { RoomIdDto } from 'src/common/dtos/RoomId.dto';
import { Chat } from 'src/models/chat.model';
import { User } from 'src/models/user.model';
import { ChatRepository } from 'src/repositories/chat.repository';
import { RecentChatInfoDto } from './dto/recentChatInfo.dto';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async makeRecentChatInfo(user: User): Promise<RecentChatInfoDto> {
    if (!user.myRoom) {
      return new RecentChatInfoDto(0, null);
    }
    // 유저에 lastChat 정보가 없을때
    if (!user.lastChat) {
      const messages = await this.chatRepository.getNotReadMessagesLatest100(
        // should check can be approached this way
        new RoomIdDto(user.myRoom._id),
      );
      if (!messages.length) {
        return new RecentChatInfoDto(0, null);
      }
      return new RecentChatInfoDto(messages.length, messages[0]);
    } else {
      // 유저에 lastChat 정보가 있을때 커서기반

      const messages = await this.chatRepository.getNotReadMessagesbyCursor(
        new RoomIdDto(user.myRoom._id),
        new ChatIdDto(user.lastChat),
      );
      // 오래지나서 채팅이 다 삭제되었을 때
      if (!messages.length) {
        return new RecentChatInfoDto(0, null);
      }
      // 내가 마지막으로 읽은 채팅이 최신 채팅일 때
      if (messages.length == 1) {
        return new RecentChatInfoDto(0, messages[0]);
      }
      // remove first index

      console.log(messages);

      messages.pop();
      return new RecentChatInfoDto(messages.length, messages[0]);
    }
    // message 길이가 0이면
  }
}
