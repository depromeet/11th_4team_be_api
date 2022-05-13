import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from 'src/models/question.model';
import { QuestionRepository } from 'src/repositories/question.repository';
import { AlarmModule } from '../alarm/alarm.module';
import { RoomsModule } from '../rooms/rooms.module';

import { UserModule } from '../users/user.module';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => AlarmModule),
    forwardRef(() => RoomsModule),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService, QuestionRepository],
})
export class QuestionsModule {}
