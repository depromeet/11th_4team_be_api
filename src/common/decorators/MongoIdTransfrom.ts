import { ExposeOptions, Transform } from 'class-transformer';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

export const failToConvertMongoId = 'mongoIdCheckFail';
/**
 * 몽고 아이디 (기댓값을 받아) 비정상일경우 null 리턴 , 아닐경우 transform
 * @param fieldName
 * @param options
 * @returns null | mongoIdObject
 */
export const MongoIdTransfrom =
  (options?: ExposeOptions) => (target, propertyKey) => {
    Transform((value) => {
      if (!mongoose.isValidObjectId(value.obj[propertyKey]))
        return failToConvertMongoId;
      return new Types.ObjectId(value.obj[propertyKey]);
    }, options)(target, propertyKey);
  };
// @Transform((value) => value.obj._id.toString())
