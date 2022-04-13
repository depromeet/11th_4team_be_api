import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CertificationMobileDto {
  @ApiProperty({ example: '12345', description: '입력 인증번호' })
  @IsString()
  @IsNotEmpty()
  inputNumber: string;
}
