import { IsNotEmpty } from "class-validator";
export class CreateUserDto {
  @IsNotEmpty()
  nickname: string

  @IsNotEmpty()
  profile: { type: number, color: string }

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  isAgreed: boolean;
}