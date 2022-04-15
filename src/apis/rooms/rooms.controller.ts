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
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/models/user.model';

@ApiTags('rooms')
@Controller('rooms')
@ApiBearerAuth()
@UseGuards(JwtStrategy)
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
    return this.roomsService.findRoom(FindRoomDto);
  }

  @ApiOperation({ summary: '룸의 세부정보를 볼수있음, 유저 목록과 함께' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: ResFindOneRoomDto,
  })
  @Get(':roomId')
  findOne(@Param() roomId: RoomIdDto) {
    //, @Body() userId: UserIdDto
    console.log(roomId);
    return this.roomsService.findOneRoomById(
      roomId,
      new UserIdDto('624c24cae25c551b68a6645c'),
    );
  }

  // TODO :  user id field 가드 통해서 받아와야함 지금은 바디로
  @ApiOperation({ summary: '유저를 룸에 집어넣는다' })
  @ApiBody({ type: UserIdDto })
  @Post(':roomId/join')
  joinRoom(@Param() roomId: RoomIdDto, @Body() userId: UserIdDto) {
    // 조인 룸시에 다른 룸에서 자동으로 나가져야함
    return this.roomsService.addUserToRoom(roomId, userId);
  }

  @ApiOperation({ summary: '룸에서 유저를 뺀다' })
  @ApiBody({ type: UserIdDto })
  @Delete(':roomId/join')
  outRoom(@Param() roomId: RoomIdDto, @Body() userId: UserIdDto) {
    // 조인 룸시에 다른 룸에서 자동으로 나가져야함
    return this.roomsService.addUserToRoom(roomId, userId);
  }

  @ApiOperation({ summary: '유저가 룸을 즐겨찾기한다' })
  @ApiBody({ type: UserIdDto })
  @Post(':roomId/favorite')
  pushRoomToUserFavoriteList(
    @Param() roomId: RoomIdDto,
    @Body() userId: UserIdDto,
  ) {
    return this.roomsService.pushRoomToUserFavoriteList(roomId, userId);
  }

  @ApiOperation({ summary: '유저가 룸을 즐겨찾기에서 뺀다' })
  @ApiBody({ type: UserIdDto })
  @Delete(':roomId/favorite')
  pullRoomToUserFavoriteList(
    @Param() roomId: RoomIdDto,
    @Body() userId: UserIdDto,
  ) {
    return this.roomsService.pullRoomToUserFavoriteList(roomId, userId);
  }

  @ApiOperation({ summary: '내 룸 정보 가져옴' })
  @Get('/my/room')
  getMyRoomInfo(@Query() FindRoomDto: FindRoomDto) {
    // console.log(FindRoomDto);
    // 경도lng 위도lat
    return this.roomsService.findRoom(FindRoomDto);
  }

  @ApiOperation({ summary: '내가 즐겨찾기한 채팅방 뽑아옴' })
  @Get('/my/favorite')
  getMyFavorite(@Query() FindRoomDto: FindRoomDto) {
    // console.log(FindRoomDto);
    // 경도lng 위도lat
    return this.roomsService.findRoom(FindRoomDto);
  }

  @ApiOperation({ summary: '인기있는 채팅방 정보 (인원순 )10개를 뽑아옴' })
  @Get('/popular')
  getPopularRooms(@Query() FindRoomDto: FindRoomDto) {
    // console.log(FindRoomDto);
    // 경도lng 위도lat
    return this.roomsService.findRoom(FindRoomDto);
  }
}
