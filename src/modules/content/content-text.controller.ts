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

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.contentTextService.findOne(key);
  }

  @Put(':key')
  update(
    @Param('key') key: string,
    @Body() updateContentTextDto: UpdateContentTextDto,
  ) {
    return this.contentTextService.update(key, updateContentTextDto);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.contentTextService.remove(key);
  }
}
