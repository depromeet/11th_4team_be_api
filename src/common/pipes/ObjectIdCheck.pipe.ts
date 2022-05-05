import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import * as mongoose from 'mongoose';

export class ObjectIdValidationPipe implements PipeTransform {
  constructor(private readonly path) {}
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('value', value);
    console.log('metadata', metadata);

    if (!mongoose.isValidObjectId(value)) {
      throw new BadRequestException(
        `${this.path}의 ${value} MongoDB ObjectId 형식이 아닙니다.`,
      );
    }

    return value;
  }
}
