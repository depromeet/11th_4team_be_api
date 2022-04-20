import { ApiProperty, PickType } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { LetterRoom } from 'src/models/letterRoom.model';
import { User } from 'src/models/user.model';
import {
  ZonedDateTime,
  ZoneId,
  DateTimeFormatter,
  LocalDate,
  LocalDateTime,
} from '@js-joda/core';
import { UserProfileDto } from 'src/common/dtos/UserProfile.dto';
import { tz } from 'moment-timezone';

function toTimeZone(time) {
  const time1 = tz(time, 'Asia/Seoul');
  console.log(time1);
  return time1.format();
}

export class LetterRoomDto extends PickType(LetterRoom, [
  'joinUserList',
] as const) {
  constructor(letterRoom: LetterRoom, myUserId: UserIdDto) {
    super();
    console.log(letterRoom.joinUserList);
    this.receiver = letterRoom.joinUserList.filter((user) => {
      return !myUserId.userId.equals(user._id);
    })[0];
    this._id = letterRoom._id;
    this._latestTime = letterRoom.letters[0].createdAt;
    this.latestMessage = letterRoom.letters[0].message;
  }

  @Exclude()
  private readonly _latestTime: Date;
  // 상대방 정보
  @ApiProperty()
  @Expose()
  @Type(() => UserProfileDto)
  receiver: UserProfileDto;

  // letterRoomId
  @ApiProperty()
  @Expose()
  _id: Types.ObjectId;

  // 최신 날짜

  @ApiProperty()
  @Expose()
  get latestTime(): string {
    return toTimeZone(this._latestTime.toISOString());
  }

  // 최신 메시지
  @ApiProperty()
  @Expose()
  latestMessage: string;

  @ApiProperty()
  @Expose()
  iWatch: boolean;
}
