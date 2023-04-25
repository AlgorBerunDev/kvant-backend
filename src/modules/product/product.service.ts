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
    search?: string,
  ): Promise<Product[]> {
    const skip = (Math.max(pageNumber, 1) - 1) * pageSize;
    const take = pageSize;
    const where: Prisma.ProductWhereInput = search
      ? {
          name: {
            contains: search,
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

  async count(
    pageNumber: number,
    pageSize: number,
    search?: string,
  ): Promise<number> {
    const skip = (Math.max(pageNumber, 1) - 1) * pageSize;
    const take = pageSize;
    const where: Prisma.ProductWhereInput = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        }
      : {};

    return this.prisma.product.count({
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
