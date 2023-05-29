import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Put,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query('pageNumber', new DefaultValuePipe(0), ParseIntPipe)
    pageNumber: number,
    @Query('pageSize', new DefaultValuePipe(5), ParseIntPipe) pageSize: number,
    @Query('search') search: string,
    @Query('sort', new DefaultValuePipe('createdAt')) sort: string,
    @Query('order', new DefaultValuePipe('desc')) order: string,
    @Query('categoryId', new DefaultValuePipe(0), ParseIntPipe)
    categoryId: number,
    @Query('priceMin', new DefaultValuePipe(0), ParseIntPipe) priceMin: number,
    @Query('priceMax', new DefaultValuePipe(0), ParseIntPipe) priceMax: number,
  ): Promise<{ data: Product[]; meta: any } | any> {
    const data = await this.productService.findAll({
      pageNumber,
      pageSize,
      search,
      sort,
      order,
      categoryId,
      priceMin,
      priceMax,
    });

    const count = await this.productService.count({
      search,
      priceMax,
      priceMin,
      categoryId,
    });

    return {
      meta: {
        pageNumber,
        pageSize,
        search,
        priceMin,
        priceMax,
        categoryId,
        sort,
        order,
        count,
      },
      data,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  @Get(':id/images')
  images(@Param('id') id: number) {
    return this.productService.images(+id);
  }

  @Post(':id/images')
  @UseInterceptors(FileInterceptor('file'))
  addImage(@UploadedFile('file') imageFile: any, @Param('id') id: number) {
    return this.productService.addImage(+id, imageFile);
  }

  @Put(':id/images/:imageId')
  @UseInterceptors(FileInterceptor('file'))
  updateImage(
    @Param('id') id: number,
    @Param('imageId') imageId: number,
    @UploadedFile('file') imageFile,
  ) {
    return this.productService.updateImage(+id, +imageId, imageFile);
  }

  @Delete(':id/images/:imageId')
  removeImage(@Param('id') id: number, @Param('imageId') imageId: number) {
    return this.productService.removeImage(+id, +imageId);
  }
}
