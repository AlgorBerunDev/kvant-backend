import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
  Put,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageBodyDto } from './dto/upload-image-body.dto';
import { ContentImageService } from './content-image.service';
import { CreateContentImageDto } from './dto/create-content-image.dto';
import { UpdateContentImageDto } from './dto/update-content-image.dto';

@Controller('content/image')
export class ContentImageController {
  constructor(private readonly contentImageService: ContentImageService) {}

  @Post()
  create(@Body() createContentImageDto: CreateContentImageDto) {
    return this.contentImageService.create(createContentImageDto);
  }

  @Get()
  async findAll(
    @Query('pageNumber', new DefaultValuePipe(0), ParseIntPipe)
    pageNumber: number,
    @Query('pageSize', new DefaultValuePipe(5), ParseIntPipe) pageSize: number,
    @Query('search') search: string,
    @Query('sort', new DefaultValuePipe('createdAt')) sort: string,
    @Query('order', new DefaultValuePipe('desc')) order: string,
  ) {
    const data = await this.contentImageService.findAll({
      pageNumber,
      pageSize,
      search,
      sort,
      order,
    });

    const count = await this.contentImageService.count({
      search,
    });

    return {
      meta: {
        pageNumber,
        pageSize,
        search,
        sort,
        order,
        count,
      },
      data,
    };
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.contentImageService.findOne(key);
  }

  @Put(':key')
  update(
    @Param('key') key: string,
    @Body() updateContentImageDto: UpdateContentImageDto,
  ) {
    return this.contentImageService.update(key, updateContentImageDto);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.contentImageService.remove(key);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile('file') imageFile: any,
    @Body() body: UploadImageBodyDto,
  ) {
    return this.contentImageService.uploadImage(imageFile, body);
  }
}
