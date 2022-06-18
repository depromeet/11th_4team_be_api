import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { QuestionListShowDto } from './QuestionList.res.dto';
export class QuestionListTotalDto {
  constructor(list: QuestionListShowDto[], realTotalCount?: number) {
    this.list = list;
    if (realTotalCount) this.realTotalCount = realTotalCount;
  }

  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  realTotalCount: number;

  @ApiProperty({
    description: '리스트 총 길이',
    type: Number,
  })
  @Expose()
  get totalCount(): number {
    return this.realTotalCount ? this.realTotalCount : this.list.length;
  }

  @ApiProperty({ type: QuestionListShowDto })
  @Type(() => QuestionListShowDto)
  @Expose()
  list: QuestionListShowDto[];
}
