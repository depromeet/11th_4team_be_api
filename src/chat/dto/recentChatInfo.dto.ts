import { Chat } from 'src/models/chat.model';

export class RecentChatInfoDto {
  constructor(notReadChatCount: number, lastChat: Chat | null) {
    this.notReadChatCount = notReadChatCount;
    this.lastChat = lastChat;
  }
  notReadChatCount: number;

  lastChat: Chat | null;
}
