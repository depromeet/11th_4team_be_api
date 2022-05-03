import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserIdDto } from '../dtos/UserId.dto';

export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('asdfasdfasd');

    const userObj = request.user.toObject();
    userObj.userIdDto = new UserIdDto(userObj._id);
    console.log(userObj);

    return userObj;
  },
);
