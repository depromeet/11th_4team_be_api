import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { STATUS_TYPE } from 'src/common/consts/enum';
import { Room } from './room.model';
import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { UserProfileDto } from 'src/common/dtos/UserProfile.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { toKRTimeZone } from 'src/common/funcs/toKRTimezone';
import { TransformObjectIdToString } from 'src/common/decorators/Expose.decorator';
import { ResShortCutRoomDto } from 'src/common/dtos/shortCutRoomInfo.res.dto';
import { BlockedUserDto } from 'src/common/dtos/BlockedUserList.dto';

const options: SchemaOptions = {
  id: false,
  collection: 'user',
  timestamps: true,
};

export type CatDocument = User & Document;

@Schema({ _id: false })
export class Profile {
  @ApiProperty({
    example: 0,
    description: '회원 프로필 캐릭터',
  })
  @IsNumber()
  @Expose()
  @Prop({ type: Number, default: 0 })
  type: number;
}

@Schema(options)
export class User {
  @ApiProperty({
    description: '유저의 고유아이디',
    type: String,
  })
  // 시리얼 라이제이션 할때 사용
  @TransformObjectIdToString({ toClassOnly: true })
  @Type(() => Types.ObjectId)
  @Expose()
  _id: Types.ObjectId;

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
  @Expose()
  phoneNumber: string;

  @ApiProperty({ example: '백엔드개발자', description: '회원 닉네임' })
  @Prop({
    required: true,
  })
  @IsString()
  @Matches(/^[가-힣]+$/)
  @Length(1, 10)
  @Expose()
  nickname: string;

  @ApiProperty({ type: () => Profile })
  @Prop({ type: Profile, ref: 'Profile' })
  @Type(() => Profile)
  @Expose()
  profile: Profile;

  // @ApiProperty({
  //   example: STATUS_TYPE.NORMAL,
  //   description: `${JSON.stringify(getEnumToArray(STATUS_TYPE))}`,
  //   enum: STATUS_TYPE,
  // })
  @Prop({
    default: STATUS_TYPE.NORMAL,
    enum: STATUS_TYPE,
  })
  @IsEnum(STATUS_TYPE)
  @Exclude()
  status: STATUS_TYPE;

  @Prop({
    default: '',
  })
  @IsString()
  @Expose()
  FCMToken: string;

  // 룸리스트 아이디 형태만 저장
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Room' }] })
  favoriteRoomList: Room[];

  @ApiProperty({
    nullable: true,
    default: 'null',
    type: ResShortCutRoomDto,
    description: '유저의 앱알림 설정 ( 앱 모든 알림 전체 )',
  })
  @Type(() => ResShortCutRoomDto)
  @Prop({ type: Types.ObjectId, ref: 'Room' })
  @IsMongoId()
  @Expose()
  myRoom: Room | null;

  @ApiProperty({
    type: Boolean,
    description: '유저의 앱알림 설정 ( 앱 모든 알림 전체 )',
  })
  @Prop({
    default: true,
  })
  @IsBoolean()
  @Expose()
  appAlarm: boolean;

  @ApiProperty({
    type: Boolean,
    description: '유저의 채팅알림 설정',
  })
  @Prop({
    default: true,
  })
  @IsBoolean()
  @Expose()
  chatAlarm: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  @IsMongoId()
  @Exclude()
  blockedUsers: Types.ObjectId[];

  @ApiProperty({
    type: [UserProfileDto],
    description: '내가 차단한 유저들.  정보탭에서 보여지는 부분들',
  })
  @Prop({
    type: [{ type: Types.ObjectId, ref: User.name }],
  })
  @IsMongoId()
  @Type(() => UserProfileDto)
  @Expose()
  iBlockUsers: UserProfileDto[];

  // @Transform(({ value }) => value || [], { toClassOnly: true })

  // only for 내부용
  @Exclude()
  userIdDto: UserIdDto;
  @Exclude()
  blockedUserDto: BlockedUserDto;

  @ApiProperty({
    type: String,
    description: '한국시간으로 보정된 시간값',
  })
  @Transform(({ value }) => toKRTimeZone(value), { toClassOnly: true })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    type: Number,
    description: '유저의 번개 점수',
  })
  @Prop({
    type: Number,
    default: 0,
  })
  @Expose()
  lightningScore: number;

  @ApiProperty({
    type: Number,
    description: '유저의 확성기 레벨',
  })
  @Prop({
    type: Number,
    default: 0,
  })
  @Expose()
  level: number;

  lastChat: Types.ObjectId;
}

export const _UserSchema = SchemaFactory.createForClass(User);

_UserSchema.set('toObject', { virtuals: true });
_UserSchema.set('toJSON', { virtuals: true });

export const UserSchema = _UserSchema;
