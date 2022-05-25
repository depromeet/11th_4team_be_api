export class RecentChatInfoDto {
  constructor(
    notReadChatCount = 0,
    lastChatMessage = '아직 아무도 채팅을 치지 않았어요',
    lastChatTime: Date | null = null,
  ) {
    this.notReadChatCount = notReadChatCount;
    this.lastChatMessage = lastChatMessage;
    this.lastChatTime = lastChatTime;
  }
  notReadChatCount: number;

  lastChatMessage: string;
  lastChatTime: Date | null;
}
