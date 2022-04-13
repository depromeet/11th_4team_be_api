import { UserModule } from './apis/users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { ChatModule } from 'src/socket/chats/chats.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from 'src/common/exceptions/http-exception.filter';
import { AuthModule } from './auth/auth.module';
import { AuthenticationModule } from 'src/apis/authentication/authentication.module';
import { CommentModule } from './apis/comments/comment.module';
import { AppController } from './app.controller';
import { RoomsModule } from './apis/rooms/rooms.module';
import { LetterModule } from './apis/letter/letter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }),
    UserModule,
    AuthenticationModule,
    AuthModule,
    CommentModule,
    ChatModule,
    RoomsModule,
    LetterModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.MODE === 'dev' ? true : false;
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    mongoose.set('debug', this.isDev);
  }
}
