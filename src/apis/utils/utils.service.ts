import { Injectable } from '@nestjs/common';
import { CategoryDto } from 'src/common/dtos/Category.dto';
import { CategoryIdDto } from 'src/common/dtos/CategoryId.dto';
import { CategoryRepository } from 'src/repositories/category.repository';

@Injectable()
export class UtilsService {
  constructor(
    private categoryRepository: CategoryRepository,
  ) { }

  async createCategory(categoryDto: CategoryDto): Promise<CategoryDto> {
    return await this.categoryRepository.create(categoryDto);
  }

  async deleteCategory(categoryIdDto: CategoryIdDto): Promise<void> {
    await this.categoryRepository.delete(categoryIdDto)
  }

  async findAllCategory(): Promise<Array<CategoryDto>> {
    return await this.categoryRepository.findAll()
  }
}
