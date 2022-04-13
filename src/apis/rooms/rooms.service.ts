import { Injectable } from '@nestjs/common';
import { RoomRepository } from 'src/repositories/room.repository';
import { CreateRoomDto } from './dto/create-room.dto';
import { FindRoomDto } from './dto/find-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(private readonly roomRepository: RoomRepository) {}
  async createRoom(createRoomDto: CreateRoomDto) {
    return await this.roomRepository.createRoom(createRoomDto);
  }

  async findRoom(findRoomDto: FindRoomDto) {
    return await this.roomRepository.findRoom(findRoomDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
