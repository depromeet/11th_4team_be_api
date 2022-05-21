import { IsBoolean } from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { TransformObjectIdToString } from 'src/common/decorators/Expose.decorator';
import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from 'src/common/dtos/UserProfile.dto';
import { toKRTimeZone } from 'src/common/funcs/toKRTimezone';
import { ALARM_STORE_TYPE } from 'src/common/consts/enum';

const options: SchemaOptions = {
  collection: 'alarm',
  timestamps: true,
};

@Schema(options)
export class Alarm {
  @ApiProperty({
    description: '개별알림의 고유아이디',
    type: String,
  })
  // 시리얼 라이제이션 할때 사용
  @TransformObjectIdToString({ toClassOnly: true })
  @Type(() => Types.ObjectId)
  @Expose()
  _id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  user: Types.ObjectId;

  // @ApiProperty({
  //   description: '알림 발송의 주체가 null 값이 될 수 있음 주의!!!',
  //   type: UserProfileDto,
  //   default: null,
  //   nullable: true,
  // })
  // @Prop({ required: true, type: Types.ObjectId, ref: 'user' })
  // sender: UserProfileDto;

  // @Prop({ required: true })
  // @IsString()
  // @IsEnum(EVENT_TYPE)
  // eventType: EVENT_TYPE;

  // @Transform(({ value }) => toKRTimeZone(value), { toClassOnly: true })
  // @Expose()
  // createdAt: Date;

  // @ApiProperty({
  //   type: String,
  //   description: '굵은 글씨 부분',
  // })
  @Prop({
    type: String,
  })
  roomName: string;

  @Prop({
    default: '',
    type: String,
  })
  nickname: string;

  @Prop({
    type: String,
  })
  content: string;

  @Prop({
    default: '',
    type: String,
  })
  deepLink: string;

  @ApiProperty({
    type: Boolean,
    description: '내가 알림을 눌러봤는지에 대한 정보',
  })
  @Prop({
    default: false,
    type: Boolean,
  })
  @IsBoolean()
  @Expose()
  iWatch: boolean;

  @ApiProperty({
    description: '알림 타입 정보',
    enum: ALARM_STORE_TYPE,
  })
  @Prop({
    required: true,
    enum: ALARM_STORE_TYPE,
  })
  alarmType: string;

  @Prop({
    type: String,
  })
  questionId: string;
}

export const AlarmSchema = SchemaFactory.createForClass(Alarm);
// 한달 간격 사라짐
AlarmSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });
