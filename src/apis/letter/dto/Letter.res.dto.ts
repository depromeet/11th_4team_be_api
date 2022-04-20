import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { LetterRoom } from 'src/models/letterRoom.model';
import { UserProfileDto } from 'src/common/dtos/UserProfile.dto';
import { tz } from 'moment-timezone';
import { Letter } from 'src/models/letter.model';

function toTimeZone(time) {
  const time1 = tz(time, 'Asia/Seoul');
  console.log(time1);
  return time1.format();
}

export class ResLetterDto {
  constructor(letter: Letter, myUserId: UserIdDto) {
    this.sender = letter.sender.toObject();
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
  @ApiProperty()
  @Transform(({ value }) => new UserProfileDto(value))
  sender: UserProfileDto;

  // letterRoomId
  @ApiProperty()
  @Transform(({ value }) => String(value))
  _id: string;

  @ApiProperty()
  @Expose()
  get createdAt(): string {
    return toTimeZone(this._createdAt.toISOString());
  }

  @ApiProperty()
  message: string;

  @ApiProperty()
  iWatch: boolean;
}
