import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';

import { Category } from 'src/models/category.model';
import { CategoryDto } from 'src/common/dtos/Category.dto';
import { CategoryIdDto } from 'src/common/dtos/CategoryId.dto';

@Injectable()
export class CategoryRepository {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>) { }

  async create(categoryDto: CategoryDto): Promise<void> {
    await this.categoryModel.create(categoryDto)
  }

  async delete(categoryIdDto: CategoryIdDto): Promise<void> {
    await this.categoryModel.deleteOne({ categoryIdDto })
  }

  async findAll(): Promise<Array<CategoryDto>> {
    return await this.categoryModel.find().sort({ priority: 1 })
      .select({
        _id: 0,
        id: 1,
        name: 1,
        imageUrl: 1,
      })
      .lean() || {}
  }
}
