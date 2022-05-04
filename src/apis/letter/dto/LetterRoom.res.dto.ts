import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { LetterRoom } from 'src/models/letterRoom.model';
import { UserProfileDto } from 'src/common/dtos/UserProfile.dto';
import { tz } from 'moment-timezone';

function toTimeZone(time) {
  const time1 = tz(time, 'Asia/Seoul');
  console.log(time1);
  return time1.format();
}

export class LetterRoomDto {
  constructor(letterRoom: LetterRoom, myUserId: UserIdDto) {
    this.receiver = letterRoom.joinUserList.filter((user) => {
      return !myUserId.userId.equals(user._id);
    })[0];
    this._id = letterRoom._id;
    this._latestTime = letterRoom.updatedAt;
    this.latestMessage = letterRoom.letters[0].message;
    if (
      letterRoom.letters[0].notWatchUser.find((userId) =>
        userId.equals(myUserId.userId),
      )
    ) {
      // 안본 유저에 있으면
      this.iWatch = false;
    } else {
      this.iWatch = true;
    }
  }

  @Exclude()
  private readonly _latestTime: Date;
  // 상대방 정보
  @ApiProperty({ description: '쪽지나누는 상대방 정보', type: UserProfileDto })
  @Type(() => UserProfileDto)
  receiver: UserProfileDto;

  // letterRoomId
  @ApiProperty({ description: '방 정보 아이디', type: String })
  @Transform(({ value }) => String(value))
  _id: string;

  @ApiProperty({ description: '제일 최신 쪽지 시간', type: String })
  @Expose()
  get latestTime(): string {
    return toTimeZone(this._latestTime.toISOString());
  }
  // 최신 메시지
  @ApiProperty({ description: '제일 최신 메시지 ', type: String })
  latestMessage: string;

  @ApiProperty({
    description: '내가 봤는지. 내가 제일 최근에 보냈으면 본거임 ',
    type: Boolean,
  })
  iWatch: boolean;
}
