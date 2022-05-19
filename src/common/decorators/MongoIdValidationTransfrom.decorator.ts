import { applyDecorators } from '@nestjs/common';
import { ApiConflictResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { ExposeOptions } from 'class-transformer';
import { Equals, IsNotEmpty, NotEquals } from 'class-validator';
import { failToConvertMongoId, MongoIdTransfrom } from './MongoIdTransfrom';

/**
 * 몽고 아이디 (기댓값을 받아) 비정상일경우 에러메시지.
 * @param fieldName
 * @param options
 * @returns null | mongoIdObject
 */
export function MongoIdValidationTransfrom(
  fieldName: string,
  options?: ExposeOptions,
) {
  return applyDecorators(
    MongoIdTransfrom(fieldName, options),
    NotEquals(failToConvertMongoId, {
      message: 'MongoId 형식 오류',
    }),
  );
}
