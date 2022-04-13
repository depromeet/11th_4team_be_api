import { applyDecorators } from '@nestjs/common';
import { ApiConflictResponse, ApiCreatedResponse } from '@nestjs/swagger';

export function ResponseSignIn() {
  return applyDecorators(
    ApiCreatedResponse({
      description: '로그인 성공 - access_token 발급',
    }),
    ApiConflictResponse({
      description: '로그인 실패',
    }),
  );
}

export function ResponseSignUp() {
  return applyDecorators(
    ApiCreatedResponse({
      description: '회원가입 성공',
    }),
    ApiConflictResponse({
      description: '가입된 회원',
    }),
  );
}
