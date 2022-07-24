import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Category, CategorySchema } from 'src/models/category.model';
import { CategoryRepository } from 'src/repositories/category.repository';

import { UtilsController } from './utils.controller';
import { UtilsService } from './utils.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])
  ],
  controllers: [UtilsController],
  providers: [UtilsService, CategoryRepository],
})
export class UtilsModule { }
