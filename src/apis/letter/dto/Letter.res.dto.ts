import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { LetterRoom } from 'src/models/letterRoom.model';
import { UserProfileDto } from 'src/common/dtos/UserProfile.dto';
import { Letter } from 'src/models/letter.model';
import { toKRTimeZone } from 'src/common/funcs/toKRTimezone';

export class ResLetterDto {
  constructor(letter: Letter, myUserId: UserIdDto) {
    this.sender = letter.sender;
    this._id = letter._id;
    this._createdAt = letter.createdAt;
    this.message = letter.message;
    if (letter.notWatchUser.find((userId) => userId.equals(myUserId.userId))) {
      // 안본 유저에 있으면
      this.iWatch = false;
    } else {
      this.iWatch = true;
    }
  }

  @Exclude()
  private readonly _createdAt: Date;
  // 상대방 정보
  @ApiProperty({ description: '쪽지를 보낸사람 프로필', type: UserProfileDto })
  @Type(() => UserProfileDto)
  @Transform(({ value }) => new UserProfileDto(value))
  @Expose()
  sender: UserProfileDto;

  // letterRoomId
  @ApiProperty({ description: '쪽지방 아이디', type: String })
  @Transform(({ value }) => String(value))
  _id: string;

  @ApiProperty({ description: '한국시간 쪽지보낸시간', type: String })
  @Expose()
  get createdAt(): string {
    return toKRTimeZone(this._createdAt);
  }

  @ApiProperty({ description: '쪽지내용', type: String })
  @Expose()
  message: string;

  @ApiProperty({ description: '내가봤는지 구분', type: Boolean })
  @Expose()
  iWatch: boolean;
}
