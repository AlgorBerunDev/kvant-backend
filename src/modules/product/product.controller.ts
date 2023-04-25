import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize: number,
    @Query('search') search?: string,
  ): Promise<{ data: Product[]; meta: any }> {
    const data = await this.productService.findAll(
      pageNumber || 0,
      pageSize || 10,
      search,
    );

    const count = await this.productService.count(
      pageNumber || 0,
      pageSize || 10,
      search,
    );

    return { data, meta: { pageNumber, pageSize, search, count } };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
