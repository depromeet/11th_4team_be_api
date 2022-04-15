import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindRoomDto } from './dto/find-room.dto';
import { MongoId } from 'src/common/dtos/MongoId.dto';
import { ObjectIdValidationPipe } from 'src/common/pipes/ObjectIdCheck.pipe';
import { ObjectId } from 'mongoose';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { RoomIdDto } from 'src/common/dtos/RoomId.dto';
import { ResFindOneRoomDto } from './dto/findOne-room.res.dto';
import { ResFindRoomDto } from './dto/find-room.res.dto copy';

import { ReqUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/models/user.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('rooms')
@Controller('rooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
// TODO : 나중에 가드오면 가드달아야함 이찬진 4월 14일
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiOperation({ summary: '룸을 생성할수 있음' })
  @ApiBody({ type: CreateRoomDto })
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.createRoom(createRoomDto);
  }

  @ApiOperation({
    summary:
      '위치정보를 토대로 내 주변 채팅방 정보를 가져옴 , 카테고리 필터링도 가능',
  })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: ResFindRoomDto,
  })
  @Get()
  findAll(@Query() FindRoomDto: FindRoomDto, @ReqUser() user: User) {
    console.log(user);
    // console.log(FindRoomDto);
    // 경도lng 위도lat
    return this.roomsService.findRoom(FindRoomDto, new UserIdDto(user._id));
  }

  @ApiOperation({ summary: '룸의 세부정보를 볼수있음, 유저 목록과 함께' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: ResFindOneRoomDto,
  })
  @Get(':roomId')
  findOne(@Param() roomId: RoomIdDto, @ReqUser() user: User) {
    //, @ReqUser() user: User
    console.log(roomId);
    return this.roomsService.findOneRoomById(roomId, new UserIdDto(user._id));
  }

  // TODO :  user id field 가드 통해서 받아와야함 지금은 바디로
  @ApiOperation({ summary: '유저를 룸에 집어넣는다' })
  @Post(':roomId/join')
  joinRoom(@Param() roomId: RoomIdDto, @ReqUser() user: User) {
    // 조인 룸시에 다른 룸에서 자동으로 나가져야함
    return this.roomsService.addUserToRoom(roomId, new UserIdDto(user._id));
  }

  @ApiOperation({ summary: '룸에서 유저를 뺀다' })
  @Delete(':roomId/join')
  outRoom(@Param() roomId: RoomIdDto, @ReqUser() user: User) {
    // 조인 룸시에 다른 룸에서 자동으로 나가져야함
    return this.roomsService.pullUserFromRoom(roomId, new UserIdDto(user._id));
  }

  @ApiOperation({ summary: '유저가 룸을 즐겨찾기한다' })
  @Post(':roomId/favorite')
  pushRoomToUserFavoriteList(
    @Param() roomId: RoomIdDto,
    @ReqUser() user: User,
  ) {
    return this.roomsService.pushRoomToUserFavoriteList(
      roomId,
      new UserIdDto(user._id),
    );
  }

  @ApiOperation({ summary: '유저가 룸을 즐겨찾기에서 뺀다' })
  @Delete(':roomId/favorite')
  pullRoomToUserFavoriteList(
    @Param() roomId: RoomIdDto,
    @ReqUser() user: User,
  ) {
    return this.roomsService.pullRoomToUserFavoriteList(
      roomId,
      new UserIdDto(user._id),
    );
  }

  @ApiOperation({ summary: '유저가 채팅 알림을 킨다' })
  @Post(':roomId/alarm')
  turnOnChatAlarm(@Param() roomId: RoomIdDto, @ReqUser() user: User) {
    // return this.roomsService.pullRoomToUserFavoriteList(roomId, userId);
  }

  @ApiOperation({ summary: '유저가 채팅 알림을 끈다' })
  @Delete(':roomId/alarm')
  turnOffChatAlarm(@Param() roomId: RoomIdDto, @ReqUser() user: User) {
    // return this.roomsService.pullRoomToUserFavoriteList(roomId, userId);
  }

  @ApiOperation({ summary: '내 룸 정보 가져옴' })
  @Get('/my/room')
  getMyRoomInfo(@ReqUser() user: User) {
    // console.log(FindRoomDto);
    // 경도lng 위도lat
    return this.roomsService.getMyRoomInfo(new UserIdDto(user._id));
  }

  @ApiOperation({ summary: '내가 즐겨찾기한 채팅방 뽑아옴' })
  @Get('/my/favorite')
  getMyFavorite() {
    // console.log(FindRoomDto);
    // 경도lng 위도lat
    return this.roomsService.getMyFavorite();
  }

  @ApiOperation({ summary: '인기있는 채팅방 정보 (인원순 )10개를 뽑아옴' })
  @Get('/popular')
  getPopularRooms(@Query() FindRoomDto: FindRoomDto) {
    // console.log(FindRoomDto);
    // 경도lng 위도lat
    return this.roomsService.getPopularRooms();
  }
}
