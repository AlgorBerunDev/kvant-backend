import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({ data: createProductDto });
  }

  async findAll(
    pageNumber: number,
    pageSize: number,
    searchName?: string,
  ): Promise<Product[]> {
    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;
    const where: Prisma.ProductWhereInput = searchName
      ? {
          name: {
            contains: searchName,
            mode: 'insensitive',
          },
        }
      : {};

    return this.prisma.product.findMany({
      skip,
      take,
      where,
    });
  }

  findOne(id: number) {
    return this.prisma.product.findFirst({ where: { id } });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
