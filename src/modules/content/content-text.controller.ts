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
import { ContentTextService } from './content-text.service';
import { UpdateContentTextDto } from './dto/update-content-text.dto';
import { CreateContentTextDto } from './dto/create-content-text.dto';

@Controller('content/text')
export class ContentTextController {
  constructor(private readonly contentTextService: ContentTextService) {}

  @Post()
  create(@Body() createContentTextDto: CreateContentTextDto) {
    return this.contentTextService.create(createContentTextDto);
  }

  @Get()
  async findAll(
    @Query('pageNumber', new DefaultValuePipe(0), ParseIntPipe)
    pageNumber: number,
    @Query('pageSize', new DefaultValuePipe(5), ParseIntPipe) pageSize: number,
    @Query('search') search: string,
  ) {
    const data = await this.contentTextService.findAll({
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

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contentTextService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContentTextDto: UpdateContentTextDto,
  ) {
    return this.contentTextService.update(id, updateContentTextDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contentTextService.remove(id);
  }
}
