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
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

const options: SchemaOptions = {
  id: false,
  collection: 'user',
  timestamps: true,
};

@Schema()
export class Profile {
  @ApiProperty({
    example: '#122345',
    description: '회원 프로필 뒷배경',
  })
  @IsString()
  @Prop({ type: String, default: '' })
  color: string;

  @ApiProperty({
    example: 0,
    description: '회원 프로필 캐릭터',
  })
  @IsNumber()
  @Prop({ type: Number, default: 0 })
  type: number;
}
export const ProfileSchema = SchemaFactory.createForClass(Profile);

// 클래스
// @Schema({ useNestedStrict: true, _id: false })
// export class Profile {
//   @IsString()
//   @Prop({ type: String, default: '' })
//   color: string;
//   @IsNumber()
//   @Prop({ type: Number, default: 0 })
//   type: number;
// }

// 밑에 정보
// @ApiProperty({
//   description: '회원 프로필',
//   type: Profile,
// })
// @Prop({
//   default: '',
//   type: Profile,
// })
// @IsObject()
// @Expose()
// profile: Profile;

@Schema(options)
export class User extends Document {
  // @Prop({
  //   unique: true,
  //   required: true,
  // })
  // @IsNotEmpty()
  // @IsString()
  // id: string;

  @ApiProperty({
    example: '010-2222-2222',
    description: '유저 휴대폰번호',
  })
  @Prop({
    required: true,
  })
  @IsPhoneNumber('KR')
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: '백엔드개발자', description: '회원 닉네임' })
  @Prop({
    default: '',
  })
  @IsString()
  @Expose()
  nickname: string;

  profileUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'Profile' })
  profile: Types.ObjectId;

  @ApiProperty({
    example: STATUS_TYPE.NORMAL,
    description: `${JSON.stringify(getEnumToArray(STATUS_TYPE))}`,
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

  // readonly readOnlyData: {
  //   id: string;
  //   nickname: string;
  //   profileUrl: string;
  //   status: STATUS_TYPE;
  //   favoriteRoomList: Room[];
  //   myRoom: Room;
  // };

  readonly comments: Comment[];
}

export const _UserSchema = SchemaFactory.createForClass(User);

// _UserSchema.virtual('readOnlyData').get(function (this: User) {
//   return {
//     id: this.id,
//     nickname: this.nickname,
//     profileUrl: this.profileUrl,
//     status: this.status,
//     favoriteRoomList: this.favoriteRoomList,
//     myRoom: this.myRoom,
//     comments: this.comments,
//   };
// });

_UserSchema.virtual('comments', {
  ref: 'comment',
  localField: '_id',
  foreignField: 'info',
});

_UserSchema.set('toObject', { virtuals: true });
_UserSchema.set('toJSON', { virtuals: true });

export const UserSchema = _UserSchema;
