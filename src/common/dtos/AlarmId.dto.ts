import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';
import { MongoIdValidationTransfrom } from '../decorators/MongoIdValidationTransfrom.decorator';
/**
 * mongoId 용 DTO
 */
export class AlarmIdDto {
  constructor(alarmId: string | Types.ObjectId) {
    if (alarmId instanceof Types.ObjectId) {
      this.alarmId = alarmId;
    } else {
      this.alarmId = new Types.ObjectId(alarmId);
    }
  }

  @ApiProperty({
    type: String,
    title: '알람 아이디',
    description: '알람의 아이디입니다 ',
  })
  @MongoIdValidationTransfrom({ toClassOnly: true })
  alarmId: Types.ObjectId;
}
