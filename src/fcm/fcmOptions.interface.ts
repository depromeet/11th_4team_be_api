import { Logger } from '@nestjs/common';

export interface FcmOptions {
  /**
   * 파이어베이스 인증 주소
   */
  credentialPath: string;
  logger?: any;
}
