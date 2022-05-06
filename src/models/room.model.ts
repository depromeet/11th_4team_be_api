import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { CATEGORY_TYPE } from 'src/common/consts/enum';
import { User } from './user.model';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { TransformObjectIdToString } from 'src/common/decorators/Expose.decorator';
import { UserProfileDto } from 'src/common/dtos/UserProfile.dto';

const options: SchemaOptions = {
  // rooms default 로 s 붙여지는데 디폴트로가는게 좋을것 같아요! (이찬진)
  collection: 'room',
  timestamps: true,
};

@Schema({ _id: false })
export class Geometry {
  @IsArray()
  @Prop({ type: Array, required: true })
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  @Type(() => Number)
  coordinates: number[];
  @IsString()
  @Prop({ type: String })
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  type: string;
}

@Schema(options)
export class Room {
  @ApiProperty({
    description: '유저의 고유아이디',
    type: String,
  })
  // 시리얼 라이제이션 할때 사용
  @TransformObjectIdToString({ toPlainOnly: true })
  @Transform((value) => value.obj._id, { toClassOnly: true })
  @Type(() => Types.ObjectId)
  @Expose()
  _id: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  @ApiProperty({
    type: String,
    title: '채팅방 이름',
    description: '채팅방의 이름입니다',
    example: '홍익대학교',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  @Prop({
    required: true,
    enum: CATEGORY_TYPE,
  })
  @ApiProperty({
    enum: CATEGORY_TYPE,
    title: '카테고리',
    description:
      '카테고리를 나타내는 상태입니다. 기획안 따라 지속적으로 추가할 예정입니다.',
    example: 'UNIVERCITY',
  })
  @IsNotEmpty()
  @IsEnum(CATEGORY_TYPE)
  @Expose()
  category: CATEGORY_TYPE;

  @Prop({ required: true, type: Number })
  @ApiProperty({
    type: Number,
    title: '반경정보',
    description: '미터 단위의 반경정보입니다',
    example: 2000,
  })
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  radius: number;

  @Prop({
    required: true,
    type: [{ type: Types.ObjectId, ref: 'User' }],
  })
  @IsNotEmpty()
  @IsArray()
  @Transform((value) => value.obj.userList, { toClassOnly: true })
  @Type(() => UserProfileDto)
  @Expose()
  userList: UserProfileDto[];

  // @ApiProperty({
  //   type: Geometry,
  //   title: 'current_location',
  //   example: '{"type":"Point","coordinates":[36.612849, 126.229883]}',
  // })
  @IsObject()
  @Prop({
    type: Geometry,
    index: '2dsphere',
  })
  @Type(() => Geometry)
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  geometry: Geometry;
  // 거리정보 반환시에 타입 선언
  @ApiProperty({ description: '거리정보' })
  @Expose()
  distance: number;
  // 유저숫자 타입 선언
  @ApiProperty({ description: '유저 숫자' })
  @Expose()
  userCount: number;
}

const _RoomSchema = SchemaFactory.createForClass(Room);

export const RoomSchema = _RoomSchema;
