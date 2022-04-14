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
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindRoomDto } from './dto/find-room.dto';

@ApiTags('rooms')
@Controller('rooms')
// TODO : 나중에 가드오면 가드달아야함 이찬진 4월 14일
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiOperation({ summary: '룸을 생성할수 있음' })
  @ApiBody({ type: CreateRoomDto })
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.createRoom(createRoomDto);
  }
  @ApiOperation({ summary: '위치정보를 토대로 내 주변 채팅방 정보를 가져옴' })
  @Get()
  @UsePipes()
  findAll(@Query() FindRoomDto: FindRoomDto) {
    // console.log(FindRoomDto);
    // 경도lng 위도lat
    return this.roomsService.findRoom(FindRoomDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
