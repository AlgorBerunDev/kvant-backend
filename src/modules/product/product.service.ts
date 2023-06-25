import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Product } from '@prisma/client';
import uploadToS3 from '@/src/utils/uploader/uploadToS3';
import convertToJpg from '@/src/utils/image/convertToJpg';
import resize from '@/src/utils/image/resize';

const IMAGE_SIZES = {
  small: 24,
  medium: 200,
  large: 800,
};

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
          select: {
            productId: true,
            categoryId: true,
            category: true,
          },
        },
        images: true,
      },
    });
  }

  async checkCategoryIdForAddProduct(id: number): Promise<boolean> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { children: true },
    });

    return category.children.length === 0;
  }

  async findAll(query: {
    pageNumber: number;
    pageSize: number;
    search?: string;
    sort?: string;
    order?: string;
    categoryId?: number;
    priceMin?: number;
    priceMax?: number;
  }): Promise<Product[]> {
    const skip = (Math.max(query.pageNumber, 1) - 1) * query.pageSize;
    const take = query.pageSize;

    return this.prisma.product.findMany({
      skip,
      take,
      where: this.makeFindAllWhere(query),
      orderBy: {
        [query.sort]: query.order,
      },
      include: { categories: true, images: true },
    });
  }

  async count(
    query: {
      search?: string;
      priceMin?: number;
      priceMax?: number;
      categoryId?: number;
    } = {},
  ): Promise<number> {
    return this.prisma.product.count({
      where: this.makeFindAllWhere(query),
    });
  }

  async findOne(id: number) {
    await this.prisma.product.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return this.prisma.product.findFirst({
      where: { id },
      include: { categories: true, images: true },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.prisma.categoriesOnProducts.deleteMany({
      where: { productId: id },
    });

    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
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
        images: true,
      },
    });
  }

  async remove(id: number) {
    await this.prisma.categoriesOnProducts.deleteMany({
      where: { productId: id },
    });
    await this.prisma.image.deleteMany({
      where: { imageableId: id, imageableType: 'Product' },
    });
    return this.prisma.product.deleteMany({ where: { id } });
  }

  images(id: number) {
    return this.prisma.image.findMany({
      where: { imageableId: id, imageableType: 'Product' },
    });
  }

  async addImage(id, file) {
    const originalImage: Buffer = await convertToJpg(file.buffer);

    const [smallImage, mediumImage, largeImage] =
      await this.resizeImagesToDifferentSizes(
        {
          buffer: originalImage,
        },
        [IMAGE_SIZES.small, IMAGE_SIZES.medium, IMAGE_SIZES.large],
      );

    const [
      savedOriginalImage,
      savedSmallImage,
      savedMediumImage,
      savedLargeImage,
    ] = await this.imagesUploader(
      [originalImage, smallImage, mediumImage, largeImage],
      file.originalname,
    );

    const original = {
      url: savedOriginalImage.Location,
      width: 800,
    };

    return this.prisma.image.create({
      data: {
        ...original,
        resize: {
          small: {
            url: savedSmallImage.Location,
            width: IMAGE_SIZES.small,
          },
          medium: {
            url: savedMediumImage.Location,
            width: IMAGE_SIZES.medium,
          },
          large: {
            url: savedLargeImage.Location,
            width: IMAGE_SIZES.large,
          },
        },
        imageableId: id,
        imageableType: 'Product',
      } as any,
    });
  }

  async updateImage(
    id: number,
    imageId: number,
    file: { buffer: Buffer; originalname: string },
  ) {
    const originalImage: Buffer = await convertToJpg(file.buffer);

    const [smallImage, mediumImage, largeImage] =
      await this.resizeImagesToDifferentSizes(
        {
          buffer: originalImage,
        },
        [IMAGE_SIZES.small, IMAGE_SIZES.medium, IMAGE_SIZES.large],
      );

    const [
      savedOriginalImage,
      savedSmallImage,
      savedMediumImage,
      savedLargeImage,
    ] = await this.imagesUploader(
      [originalImage, smallImage, mediumImage, largeImage],
      file.originalname,
    );

    //TODO: remove from bucket

    const original = {
      url: savedOriginalImage.Location,
      width: 800,
    };

    const where = {
      id: imageId,
      imageableId: id,
      imageableType: 'Product',
    };

    await this.prisma.image.updateMany({
      where,
      data: {
        ...original,
        resize: {
          small: {
            url: savedSmallImage.Location,
            width: IMAGE_SIZES.small,
          },
          medium: {
            url: savedMediumImage.Location,
            width: IMAGE_SIZES.medium,
          },
          large: {
            url: savedLargeImage.Location,
            width: IMAGE_SIZES.large,
          },
        },
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

  makeFindAllWhere({
    search,
    priceMin,
    priceMax,
    categoryId,
  }: {
    search?: string;
    priceMin?: number;
    priceMax?: number;
    categoryId?: number;
  }) {
    const where: Prisma.ProductWhereInput = {};

    if (search) {
      Object.assign(where, { name: { contains: search, mode: 'insensitive' } });
    }

    const price = {};

    if (priceMin) {
      Object.assign(price, { gte: priceMin });
    }

    if (priceMax && priceMax > priceMin) {
      Object.assign(price, { lte: priceMax });
    }

    if (price) {
      Object.assign(where, { price } as Prisma.ProductWhereInput);
    }

    if (categoryId && categoryId > 0) {
      const whereByCategoryId: Prisma.ProductWhereInput = {
        categories: {
          some: {
            categoryId,
          },
        },
      };

      Object.assign(where, whereByCategoryId);
    }

    return where;
  }

  resizeImagesToDifferentSizes(
    file: { buffer: Buffer },
    sizes: number[],
  ): Promise<Buffer[]> {
    return Promise.all(
      sizes.map((size) => resize({ buffer: file.buffer }, size)),
    );
  }

  imagesUploader(
    images: Buffer[],
    originalname: string,
  ): Promise<{ Location: string }[]> {
    return Promise.all(
      images.map((image) => uploadToS3({ buffer: image, originalname })),
    );
  }
}
