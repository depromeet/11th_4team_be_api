import { UserModule } from './apis/users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';

import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from 'src/common/exceptions/http-exception.filter';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './apis/rooms/rooms.module';
import { LetterModule } from './apis/letter/letter.module';
import { QuestionsModule } from './apis/questions/questions.module';
import { AlarmModule } from './apis/alarm/alarm.module';
import mongooseLeanDefaults from 'mongoose-lean-defaults';
import { BullModule } from '@nestjs/bull';
import { FcmModule } from './fcm/fcm.module';
import { ChatModule } from './chat/chat.module';
import * as Joi from 'joi';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: Number(configService.get('REDIS_PORT')),
          retryStrategy: (times) => {
            // check connection
            console.log('could not connect to redis!');
            process.exit(1);
          },
        },
      }),

      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('dev', 'prod', 'test', 'provision')
          .default('prod'),
        PORT: Joi.number().default(8082),
        MONGO_URI: Joi.string(),
        JWT_SECRET: Joi.string(),
        SWAGGER_USER: Joi.string(),
        SWAGGER_PASSWORD: Joi.string(),
        REDIS_HOST: Joi.string(),
        REDIS_PORT: Joi.number(),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      connectionFactory: (connection) => {
        connection.plugin(mongooseLeanDefaults);
        return connection;
      },
    }),
    UserModule,
    AuthModule,
    RoomsModule,
    LetterModule,
    QuestionsModule,
    AlarmModule,
    FcmModule,
    ChatModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean =
    process.env.NODE_ENV === 'dev' ? true : false;
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    mongoose.set('debug', this.isDev);
  }
}
