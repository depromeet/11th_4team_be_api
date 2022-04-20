import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import * as mongoose from 'mongoose';

export class ObjectIdValidationPipe implements PipeTransform {
  //   readonly StatusOptions = [BoardStatus.PRIVATE, BoardStatus.PUBLIC];

  transform(value: any, metadata: ArgumentMetadata) {
    console.log('value', value);
    console.log('metadata', metadata);

    if (!mongoose.isValidObjectId(value)) {
      throw new BadRequestException(
        `${value} 가 MongoDB ObjectId 형식이 아닙니다.`,
      );
    }

    return new mongoose.Types.ObjectId(value);
  }
}
