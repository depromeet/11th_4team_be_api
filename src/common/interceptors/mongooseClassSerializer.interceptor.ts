import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import {
  instanceToInstance,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { isInstance, IsInstance } from 'class-validator';
import { map, Observable } from 'rxjs';

export function MongooseClassSerializerInterceptor(dto: any) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data) => {
        //TODO : 클래스 타입에 따라서 분기 처리 하기!!
        if (data.constructor === Object) {
          // 리터럴 객체
          console.log('다른 인스턴스');

          return plainToInstance(this.dto, data, {
            excludeExtraneousValues: true,
          });
        } else if (data.constructor === this.dto) {
          // 리터럴 객체가 아닌 생성자를 통해 생성된 객체이고 , 생성자가 같다면 그대로 리턴
          return data;
        } else {
          console.log('다른 인스턴스');
          return plainToInstance(this.dto, instanceToPlain(data), {
            excludeExtraneousValues: true,
          });
        }

        // if(data inta)
      }),
    );
  }
}
