import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CategoryDto } from 'src/common/dtos/Category.dto';
import { CategoryIdDto } from 'src/common/dtos/CategoryId.dto';
import { UtilsService } from './utils.service';

@ApiTags('')
@Controller('')
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard)
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) { }

  @Get('category')
  getCategory() {
    return this.utilsService.findAllCategory()
  }

  @Post('category')
  createCategory(@Body() categoryDto: CategoryDto): Promise<CategoryDto> {
    return this.utilsService.createCategory(categoryDto)
  }

  @Delete('category')
  deleteCategory(@Body() categoryIdDto: CategoryIdDto) {
    return this.utilsService.deleteCategory(categoryIdDto)
  }
}
