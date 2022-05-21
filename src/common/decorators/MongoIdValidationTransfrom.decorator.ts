import { applyDecorators } from '@nestjs/common';
import { ApiConflictResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { ExposeOptions } from 'class-transformer';
import { Equals, IsNotEmpty, NotEquals } from 'class-validator';
import { failToConvertMongoId, MongoIdTransfrom } from './MongoIdTransfrom';
import 'reflect-metadata';
/**
 * 몽고 아이디 (기댓값을 받아) 비정상일경우 에러메시지.
 * @param fieldName
 * @param options
 * @returns null | mongoIdObject
 */
export function MongoIdValidationTransfrom(options?: ExposeOptions) {
  // console.log('tests');
  return applyDecorators(
    // passDecoratedPropertyName(),
    MongoIdTransfrom(options),
    NotEquals(failToConvertMongoId, {
      message: 'MongoId 형식 오류',
    }),
  );
}

// // function second() {}
// const PropertyNameKey = Symbol('PropertyNameKey');
// function savePropertyName(decoratedPropertyName: string) {
//   return Reflect.metadata(PropertyNameKey, decoratedPropertyName);
// }
// function getFormat(target: any, propertyKey: string) {
//   return Reflect.getMetadata(PropertyNameKey, target, propertyKey);
// }

// function passDecoratedPropertyName() {
//   console.log('tests');
//   return function (target: any, decoratedPropertyName: string) {
//     console.log('second(): factory evaluated', decoratedPropertyName);
//     savePropertyName(decoratedPropertyName);
//   };
// }
