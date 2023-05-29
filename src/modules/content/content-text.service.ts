import { Injectable } from '@nestjs/common';
import { CreateContentTextDto } from './dto/create-content-text.dto';
import { UpdateContentTextDto } from './dto/update-content-text.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ContentTextService {
  constructor(private prisma: PrismaService) {}

  create(createContentTextDto: CreateContentTextDto) {
    return this.prisma.contentText.create({
      data: { ...createContentTextDto, type: 'ContentText' },
    });
  }

  findAll(query: { pageSize: number; pageNumber: number; search: string }) {
    const skip = (Math.max(query.pageNumber, 1) - 1) * query.pageSize;
    const take = query.pageSize;

    return this.prisma.contentText.findMany({
      where: { text: { contains: query.search, mode: 'insensitive' } },
      take,
      skip,
    });
  }

  findOne(id: number) {
    return this.prisma.contentText.findUnique({ where: { id } });
  }

  async update(id: number, updateContentTextDto: UpdateContentTextDto) {
    await this.prisma.contentText.update({
      where: { id },
      data: updateContentTextDto,
    });

    return this.prisma.contentText.findUnique({ where: { id } });
  }

  remove(id: number) {
    return this.prisma.contentText.deleteMany({ where: { id } });
  }
}
