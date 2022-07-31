import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CategoryDto } from 'src/common/dtos/Category.dto';
import { CategoryIdDto } from 'src/common/dtos/CategoryId.dto';
import { UtilsService } from './utils.service';

@ApiTags('')
@Controller('')
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard)
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @ApiOperation({
    summary: '카테고리 정보'
  })
  @Get('category')
  async getCategory() {
    return await this.utilsService.findAllCategory();
  }

  // @ApiOperation({
  //   summary: '카테고리 추가',
  // })
  // @Post('category')
  // async createCategory(@Body() categoryDto: CategoryDto): Promise<void> {
  //   return await this.utilsService.createCategory(categoryDto)
  // }

  // @ApiOperation({
  //   summary: '카테고리 삭제',
  // })
  // @Delete('category')
  // async deleteCategory(@Body() categoryIdDto: CategoryIdDto) {
  //   return await this.utilsService.deleteCategory(categoryIdDto)
  // }
}
