import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UploadedFile,
  UseInterceptors,
  Query,
  DefaultValuePipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(
    @Query('isTree', new DefaultValuePipe(true), ParseBoolPipe)
    isTree: boolean,
  ) {
    return this.categoryService.findAll({ isTree });
  }

  @Get('/banners')
  banners() {
    return this.categoryService.banners();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch('/orders')
  updateOrders(@Body() body: any) {
    return this.categoryService.updateOrders(body.idWithOrders);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  addImage(
    @UploadedFile('file') imageFile: any,
    @Param('id') categoryId: number,
  ) {
    return this.categoryService.addImage(+categoryId, imageFile, 'image');
    //
  }

  @Delete(':id/image')
  removeImage(@Param('id') categoryId: number) {
    return this.categoryService.removeImage(+categoryId, 'image');
  }

  @Post(':id/icon')
  @UseInterceptors(FileInterceptor('file'))
  addIcon(
    @UploadedFile('file') imageFile: any,
    @Param('id') categoryId: number,
  ) {
    console.log(imageFile);
    return this.categoryService.addImage(+categoryId, imageFile, 'icon');
  }

  @Delete(':id/icon')
  removeIcon(@Param('id') categoryId: number) {
    return this.categoryService.removeImage(+categoryId, 'icon');
  }
}
