import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { setupSwagger } from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  app.useGlobalPipes(
    new ValidationPipe({
      // transform으로 형식변환가능한지 체크 dto에 transfrom 없어도 typescript type 보고 형변환 해줌
      //  enableImplicitConversion 옵션은 타입스크립트의 타입으로 추론가능하게 설정함
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  setupSwagger(app);
  //앱서버용
  app.getHttpAdapter().getInstance().set('etag', false);
  app.enableCors({ origin: true, credentials: true });

  const PORT = process.env.PORT;

  await app.listen(PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
