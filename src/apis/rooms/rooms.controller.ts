import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindRoomDto } from './dto/find-room.dto';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { RoomIdDto } from 'src/common/dtos/RoomId.dto';
import { ResFindOneRoomDto } from './dto/findOne-room.res.dto';
import { ResFindRoomDto } from './dto/find-room.res.dto copy';

import { ReqUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/models/user.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ResChatAlarmToggleDto } from './dto/chatAlarmToggle.res.dto';
import { ResFavoriteToggleDto } from './dto/FavoriteToggle.res.dto';
import { Room } from 'src/models/room.model';
import { ResShortCutRoomDto } from 'src/common/dtos/shortCutRoomInfo.res.dto';
import { MyRoomInfoDto } from './dto/myRoomInfo.res.dto';
import { RoomUserListDto } from './dto/roomUserList.res.dto';

@ApiTags('rooms')
@Controller('rooms')
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // @ApiOperation({ summary: '룸을 생성할수 있음' })
  // @ApiBody({ type: CreateRoomDto })
  // @ApiResponse({
  //   status: 201,
  //   description: '요청 성공시',
  //   type: Room,
  // })
  // @Post()
  // create(@Body() createRoomDto: CreateRoomDto) {
  //   return this.roomsService.createRoom(createRoomDto);
  // }

  @ApiOperation({
    summary:
      '(지도용)위치정보를 토대로 내 주변 채팅방 정보를 가져옴 , 카테고리 필터링도 가능',
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
    return this.roomsService.findRoom(FindRoomDto, user.userIdDto);
  }
  @ApiOperation({ summary: '(채팅탭용)내 룸 정보 가져옴' })
  @Get('/my/room')
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: MyRoomInfoDto,
  })
  @ApiResponse({
    status: 200,
    description: '내 방이없으면',
  })
  getMyRoomShortCutInfo(@ReqUser() user: User) {
    // console.log(FindRoomDto);
    // 경도lng 위도lat
    return this.roomsService.getMyRoomInfo(user.userIdDto, user);
  }

  @ApiOperation({ summary: '(채팅탭용)내가 즐겨찾기한 채팅방 뽑아옴' })
  @Get('/my/favorite')
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: [ResShortCutRoomDto],
  })
  getMyFavorite(@ReqUser() user: User) {
    // console.log(FindRoomDto);
    // 경도lng 위도lat
    return this.roomsService.getMyFavorite(new UserIdDto(user._id));
  }

  @ApiOperation({
    summary: '(채팅탭용)인기있는 채팅방 정보 (인원순 )10개를 뽑아옴',
  })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: [ResShortCutRoomDto],
  })
  @Get('/popular')
  getPopularRooms() {
    console.log('asdfasdfasdf');
    // 경도lng 위도lat
    return this.roomsService.getPopularRooms();
  }
  @ApiOperation({ summary: '유저가 채팅방에 입장할 때 ( 모든 경우 사용)' })
  @Post(':roomId/join')
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: ResFindOneRoomDto,
  })
  joinRoom(@Param() roomId: RoomIdDto, @ReqUser() user: User) {
    // 조인 룸시에 다른 룸에서 자동으로 나가져야함
    return this.roomsService.addUserToRoom(
      roomId,
      user.userIdDto,
      user.blockedUserDto,
    );
  }

  @ApiOperation({ summary: '유저가 채팅방에서 아예 나가버릴때' })
  @Delete(':roomId/join')
  outRoom(@Param() roomId: RoomIdDto, @ReqUser() user: User) {
    // 조인 룸시에 다른 룸에서 자동으로 나가져야함
    return this.roomsService.pullUserFromRoom(roomId, user.userIdDto);
  }

  @ApiOperation({
    summary: '채팅방 내부에서 사이드바를 열었을때 불러오는 유저 리스트',
  })
  @Get(':roomId/userList')
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: RoomUserListDto,
  })
  @ApiResponse({
    status: 400,
    description:
      '유저가 들어간 방 정보 없음 ,유저가 들어간 방정보와 파라미터가 일치하지 않음',
  })
  getRoomUserList(@Param() roomId: RoomIdDto, @ReqUser() user: User) {
    // 조인 룸시에 다른 룸에서 자동으로 나가져야함
    return this.roomsService.findRoomInUserList(roomId, user);
  }

  @ApiOperation({ summary: '유저가 룸을 즐겨찾기에서 빼고넣는다' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: ResFavoriteToggleDto,
  })
  @Patch(':roomId/favorite')
  toggleRoomToUserFavoriteList(
    @Param() roomId: RoomIdDto,
    @ReqUser() user: User,
  ) {
    return this.roomsService.toggleRoomToUserFavoriteList(
      roomId,
      user.userIdDto,
    );
  }

  @ApiOperation({ summary: '유저가 채팅 알림을 키고 끈다' })
  @Patch(':roomId/alarm')
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: ResChatAlarmToggleDto,
  })
  turnOnChatAlarm(@Param() roomId: RoomIdDto, @ReqUser() user: User) {
    return this.roomsService.toggleChatAlarm(user.userIdDto);
  }
}
