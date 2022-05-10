import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SendLightningSuccessDtoResDto {
  constructor(sendLightningSuccess: boolean) {
    this.sendLightningSuccess = sendLightningSuccess;
  }
  @ApiProperty({
    type: Boolean,
    default: false,
    description: '번개보낸 성공여부',
  })
  @Expose()
  sendLightningSuccess: boolean;
}
