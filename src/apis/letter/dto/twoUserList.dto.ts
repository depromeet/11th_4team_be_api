import { Types } from 'mongoose';
import { UserIdDto } from 'src/common/dtos/UserId.dto';

export class TwoUserListDto {
  constructor(user1: UserIdDto, user2: UserIdDto) {
    this.userList.push(user1.userId);
    this.userList.push(user2.userId);
  }
  userList: Types.ObjectId[];
}
