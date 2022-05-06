import { Types } from 'mongoose';

export class BlockedUserDto {
  constructor(blockedUsers: Types.ObjectId[]) {
    this.blockedUsers = blockedUsers;
  }
  blockedUsers: Types.ObjectId[];
}
