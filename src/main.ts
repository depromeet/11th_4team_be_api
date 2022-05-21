import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { SuccessInterceptor } from './common/interceptors/sucess.interceptor';
import { setupSwagger } from './utils/swagger';
import { BullModule } from '@nestjs/bull';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setViewEngine('hbs');

  //앱서버용
  app.getHttpAdapter().getInstance().set('etag', false);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    // prefix: '/v',
  });
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      // transform으로 형식변환가능한지 체크 dto에 transfrom 없어도 typescript type 보고 형변환 해줌
      //  enableImplicitConversion 옵션은 타입스크립트의 타입으로 추론가능하게 설정함
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      // forbidNonWhitelisted: true,
    }),
  );
  setupSwagger(app);

  const PORT = process.env.PORT;

  await app.listen(PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
