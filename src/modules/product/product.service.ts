import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return await this.prisma.product.create({
      data: {
        ...createProductDto,
        categories: {
          create: createProductDto.categories.map((category) => {
            return {
              assignedBy: 'user',
              category: {
                connect: {
                  id: category.id,
                },
              },
            };
          }),
        },
      },
      include: {
        categories: {
          select: { productId: true, categoryId: true, category: true },
        },
      },
    });
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

  async findOne(id: number) {
    await this.prisma.product.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return this.prisma.product.findFirst({
      where: { id },
      include: { categories: true },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.prisma.categoriesOnProducts.deleteMany({
      where: { productId: id },
    });

    return this.prisma.product.update({
      where: { id },
      data: {
        categories: {
          create: updateProductDto.categories.map((category) => {
            return {
              assignedBy: 'user',
              category: {
                connect: {
                  id: category.id,
                },
              },
            };
          }),
        },
      },
      include: {
        categories: {
          select: { productId: true, categoryId: true, category: true },
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }

  images(id: number) {
    return this.prisma.image.findMany({
      where: { imageableId: id, imageableType: 'Product' },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addImage(id, file) {
    //TODO: add converter image to jpg
    //TODO: add resize image to small, medium, large
    let resize = {};

    const original = {
      url: 'https://placehold.co/800x800',
      width: 800,
    };

    if (process.env.NODE_ENV !== 'production') {
      resize = {
        small: {
          url: 'https://placehold.co/24x24',
          width: 24,
        },
        medium: {
          url: 'https://placehold.co/200x200',
          width: 200,
        },
        large: {
          url: 'https://placehold.co/800x800',
          width: 800,
        },
      };
    }

    return this.prisma.image.create({
      data: {
        ...original,
        resize,
        imageableId: id,
        imageableType: 'Product',
      } as any,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateImage(id, imageId, file) {
    //TODO: add converter image to jpg
    //TODO: add resize image to small, medium, large
    //TODO: remove from bucket

    let resize = {};
    const original = {
      url: 'https://placehold.co/800x800',
      width: 800,
    };
    if (process.env.NODE_ENV !== 'production') {
      resize = {
        small: {
          url: 'https://placehold.co/24x24',
          width: 24,
        },
        medium: {
          url: 'https://placehold.co/200x200',
          width: 200,
        },
        large: {
          url: 'https://placehold.co/800x800',
          width: 800,
        },
      };
    }

    const where = {
      id: imageId,
      imageableId: id,
      imageableType: 'Product',
    };

    await this.prisma.image.updateMany({
      where,
      data: {
        ...original,
        resize,
      } as any,
    });

    return this.prisma.image.findFirst({
      where,
    });
  }

  removeImage(id: number, imageId: number) {
    return this.prisma.image.deleteMany({
      where: { id: imageId, imageableId: id, imageableType: 'Product' },
    });
  }
}
