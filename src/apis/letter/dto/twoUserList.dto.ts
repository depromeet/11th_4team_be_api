import { Types } from 'mongoose';
import { UserIdDto } from 'src/common/dtos/UserId.dto';

export class TwoUserListDto {
  constructor(recevier: UserIdDto, sender: UserIdDto) {
    this.userList.push(recevier.userId);
    this.userList.push(sender.userId);
    this.recevier = recevier.userId;
    this.sender = sender.userId;
  }
  userList: Types.ObjectId[] = [];
  recevier: Types.ObjectId;
  sender: Types.ObjectId;
}
