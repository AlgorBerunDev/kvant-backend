import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UpdateContentDataDto } from './dto/update-content-data.dto';
import { CreateContentDataDto } from './dto/create-content-data.dto';
import { ContentDataService } from './content-data.service';

@Controller('content/data')
export class ContentDataController {
  constructor(private readonly contentDataService: ContentDataService) {}

  @Post()
  create(@Body() createContentDataDto: CreateContentDataDto) {
    return this.contentDataService.create(createContentDataDto);
  }

  @Get()
  async findAll(
    @Query('pageNumber', new DefaultValuePipe(0), ParseIntPipe)
    pageNumber: number,
    @Query('pageSize', new DefaultValuePipe(5), ParseIntPipe) pageSize: number,
    @Query('search') search: string,
  ) {
    const data = await this.contentDataService.findAll({
      pageNumber,
      pageSize,
      search,
    });

    return {
      data,
      meta: {
        pageNumber,
        pageSize,
        search,
      },
    };
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.contentDataService.findOne(key);
  }

  @Put(':key')
  update(
    @Param('key') key: string,
    @Body() updateContentDataDto: UpdateContentDataDto,
  ) {
    return this.contentDataService.update(key, updateContentDataDto);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.contentDataService.remove(key);
  }
}
