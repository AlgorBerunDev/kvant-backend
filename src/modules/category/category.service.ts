import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'nestjs-prisma';
import convertToJpg from '@/src/utils/image/convertToJpg';
import uploadToS3 from '@/src/utils/uploader/uploadToS3';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({ data: createCategoryDto });
  }

  findAll() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: { include: { children: true } },
      },
    });
  }

  banners() {
    return this.prisma.category.findMany({
      where: { isBanner: true },
    });
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  remove(id: number) {
    return this.prisma.category.deleteMany({ where: { id } });
  }

  async addImage(categoryId: number, file: any, fieldName: string) {
    const originalImage: Buffer = await convertToJpg(file.buffer);

    const savedImage = await uploadToS3({
      buffer: originalImage,
      originalname: file.originalname,
    });

    await this.prisma.category.update({
      where: { id: categoryId },
      data: {
        [fieldName]: savedImage.Location,
      },
    });

    return this.prisma.category.findUnique({
      where: { id: categoryId },
    });
  }

  removeImage(id: number, fieldName: string) {
    const data = {};
    data[fieldName] = null;
    return this.prisma.category.update({
      where: { id },
      data: data,
    });
  }
}
