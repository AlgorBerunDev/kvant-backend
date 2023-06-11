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
  Patch,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from 'nestjs-prisma';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    //TODO: move to utils
    function getIdsNestedObject(object) {
      const { parent, ...obj } = object;
      if (object.parent) {
        return [obj, ...getIdsNestedObject(object.parent)];
      } else {
        return [obj];
      }
    }

    const categoriesTree = await this.prisma.category.findFirst({
      where: { id: createProductDto.categories[0].id },
      include: {
        parent: {
          include: {
            parent: {
              include: {
                parent: true,
              },
            },
          },
        },
      },
    });
    //TODO: move to create product DTO validation
    const accessToAddProduct =
      await this.productService.checkCategoryIdForAddProduct(
        createProductDto.categories[0].id,
      );
    if (!accessToAddProduct)
      return {
        message:
          "Bu oxirgi children category emas, umuman children categorysi bo'magan categoryga maxsulot qo'shish mumkin",
      };
    createProductDto.categories = getIdsNestedObject(categoriesTree);
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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    //TODO: move to utils
    function getIdsNestedObject(object) {
      const { parent, ...obj } = object;
      if (object.parent) {
        return [obj, ...getIdsNestedObject(object.parent)];
      } else {
        return [obj];
      }
    }

    const categoriesTree = await this.prisma.category.findFirst({
      where: { id: updateProductDto.categories[0].id },
      include: {
        parent: {
          include: {
            parent: {
              include: {
                parent: true,
              },
            },
          },
        },
      },
    });
    //TODO: move to create product DTO validation
    const accessToAddProduct =
      await this.productService.checkCategoryIdForAddProduct(
        updateProductDto.categories[0].id,
      );
    if (!accessToAddProduct)
      return {
        message:
          "Bu oxirgi children category emas, umuman children categorysi bo'magan categoryga maxsulot qo'shish mumkin",
      };
    updateProductDto.categories = getIdsNestedObject(categoriesTree);
    //TODO: add update all parent category
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
