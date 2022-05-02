import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { QUESTION_FIND_FILTER_TYPE } from 'src/common/consts/enum';

export class QuestionFindRequestDto {
  @ApiProperty({ enum: QUESTION_FIND_FILTER_TYPE })
  @IsEnum(QUESTION_FIND_FILTER_TYPE)
  filter: QUESTION_FIND_FILTER_TYPE;
}
