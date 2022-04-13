import { NicknameDto, UpdateProfileDto } from '../apis/users/dto/user.dto';
import { PhoneNumberDto } from '../apis/users/dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, HttpException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { User } from 'src/models/user.model';
import { CertificationMobileDto } from 'src/apis/authentication/dto/send-mobile.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findOneByUserId(userId: string | Types.ObjectId): Promise<User | null> {
    const user = await this.userModel.findOne({ _id: userId });
    return user;
  }

  async findOneByPhoneNumber(phoneNumber: PhoneNumberDto) {
    const user = await this.userModel.findOne(phoneNumber);
    return user;
  }

  async findOneByNickname(nickname: NicknameDto) {
    const user = await this.userModel.findOne(nickname);
    return user;
  }

  async existByNickName(nickname: string): Promise<boolean> {
    try {
      const result = await this.userModel.exists({ nickname });
      return result;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async create(phoneNumber: PhoneNumberDto): Promise<any> {
    return await this.userModel.create(phoneNumber);
  }

  async updateProfile(profileData: UpdateProfileDto): Promise<any> {
    return await this.userModel.updateOne(profileData);
  }
}
