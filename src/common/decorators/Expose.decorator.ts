import { ExposeOptions, Transform } from 'class-transformer';

export const TransformObjectIdToString =
  (options?: ExposeOptions) => (target, propertyKey) => {
    Transform((value) => value.obj._id.toString(), options)(
      target,
      propertyKey,
    );
  };
// @Transform((value) => value.obj._id.toString())
