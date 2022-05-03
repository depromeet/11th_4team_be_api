import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { getEnumToArray, STATUS_TYPE } from 'src/common/consts/enum';
import { Room } from './room.model';
import * as mongoose from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { ApiProperty } from '@nestjs/swagger';
import { Comment } from './comment.model';
import { Exclude, Expose } from 'class-transformer';
import { Types } from 'mongoose';
import { UserProfileDto } from 'src/common/dtos/UserProfile.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';

const options: SchemaOptions = {
  id: false,
  collection: 'user',
  timestamps: true,
};

@Schema({ _id: false })
export class Profile {
  @ApiProperty({
    example: 0,
    description: '회원 프로필 캐릭터',
  })
  @IsNumber()
  @Prop({ type: Number, default: 0 })
  type: number;
}

@Schema(options)
export class User extends Document {
  @ApiProperty({
    example: '010-2222-2222',
    description: '유저 휴대폰번호',
  })
  @Prop({
    required: true,
    unique: true,
  })
  @IsPhoneNumber('KR')
  @IsNotEmpty()
  @Exclude()
  phoneNumber: string;

  @ApiProperty({ example: '백엔드개발자', description: '회원 닉네임' })
  @Prop({
    required: true,
  })
  @IsString()
  nickname: string;

  @ApiProperty({ type: () => Profile })
  @Prop({ type: Profile, ref: 'Profile' })
  profile: Profile;

  @ApiProperty({
    example: STATUS_TYPE.NORMAL,
    description: `${JSON.stringify(getEnumToArray(STATUS_TYPE))}`,
    enum: STATUS_TYPE,
  })
  @Prop({
    default: STATUS_TYPE.NORMAL,
  })
  @IsEnum(STATUS_TYPE)
  status: STATUS_TYPE;

  @Prop({
    default: '',
  })
  @IsString()
  FCMToken: string;

  // 룸리스트 아이디 형태만 저장
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }] })
  favoriteRoomList: Room[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  @IsObjectId()
  myRoom: Room;

  @ApiProperty({
    type: Boolean,
    description: '유저의 앱알림 설정 ( 앱 모든 알림 전체 )',
  })
  @Prop({
    default: true,
  })
  @IsBoolean()
  appAlarm: boolean;

  @ApiProperty({
    type: Boolean,
    description: '유저의 채팅알림 설정',
  })
  @Prop({
    default: true,
  })
  @IsBoolean()
  chatAlarm: boolean;

  @ApiProperty({
    type: [UserProfileDto],
    description:
      '차단 기능시 안보여저야 하는 유저 목록 ( 내가 차단 , 차단당한 유저 등 아이디 포함 )',
  })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  @IsObjectId()
  blockedUsers: User[];

  @ApiProperty({
    type: [UserProfileDto],
    description: '내가 차단한 유저들.  정보탭에서 보여지는 부분들',
  })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  @IsObjectId()
  iBlockUsers: User[];

  // only for 내부용
  @Exclude()
  userIdDto: UserIdDto;
}

export const _UserSchema = SchemaFactory.createForClass(User);

_UserSchema.set('toObject', { virtuals: true });
_UserSchema.set('toJSON', { virtuals: true });

export const UserSchema = _UserSchema;
