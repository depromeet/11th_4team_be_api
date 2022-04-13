import { PhoneNumberDto } from '../users/dto/user.dto';
import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { generateRandomCode } from 'src/common/funcs/random-code.func';
import { CertificationMobileDto } from './dto/send-mobile.dto';

@Injectable()
export class AuthenticationService {
  constructor(private userRepository: UserRepository) {}

  async sendMobileAuthNumber(
    data: PhoneNumberDto,
  ): Promise<CertificationMobileDto> {
    const { phoneNumber } = data;
    if (phoneNumber) {
      return {
        inputNumber: generateRandomCode(5),
      };
    }
  }

  async certificationMobile(inputNumber: string): Promise<boolean> {
    const authNumber = await this.sendMobileAuthNumber({
      phoneNumber: '010-2246-2294',
    });
    if (authNumber.inputNumber !== inputNumber) {
      return true;
    } else {
      return false;
    }
  }
}
