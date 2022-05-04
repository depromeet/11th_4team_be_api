import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CanChangeNicknameResDto {
  constructor(
    myRoomExist: boolean,
    nicknameExist: boolean,
    canChange: boolean,
  ) {
    this.myRoomExist = myRoomExist;
    this.nicknameExist = nicknameExist;
    this.canChange = canChange;
  }
  @ApiProperty({ type: Boolean, description: '내방이 존재하는지' })
  @Expose()
  myRoomExist: boolean;

  @ApiProperty({ type: Boolean, description: '닉네임이 존재하는지' })
  @Expose()
  nicknameExist: boolean;

  @ApiProperty({ type: Boolean, description: '유저이름을 바꿀수있는지' })
  @Expose()
  canChange: boolean;
}
