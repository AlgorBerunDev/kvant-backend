import { Injectable } from '@nestjs/common';
import { CreateContentDataDto } from './dto/create-content-data.dto';
import { UpdateContentDataDto } from './dto/update-content-data.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ContentDataService {
  constructor(private prisma: PrismaService) {}

  create(createContentDataDto: CreateContentDataDto) {
    return this.prisma.contentData.create({
      data: { ...createContentDataDto, type: 'ContentData' },
    });
  }

  findAll(query: { pageSize: number; pageNumber: number; search: string }) {
    const skip = (Math.max(query.pageNumber, 1) - 1) * query.pageSize;
    const take = query.pageSize;

    return this.prisma.contentData.findMany({
      where: { key: { contains: query.search, mode: 'insensitive' } },
      take,
      skip,
    });
  }

  findOne(key: string) {
    return this.prisma.contentData.findUnique({ where: { key } });
  }

  async update(key: string, updateContentDataDto: UpdateContentDataDto) {
    await this.prisma.contentData.update({
      where: { key },
      data: updateContentDataDto,
    });

    return this.prisma.contentData.findUnique({
      where: { key: updateContentDataDto.key },
    });
  }

  remove(key: string) {
    return this.prisma.contentData.deleteMany({ where: { key } });
  }
}
