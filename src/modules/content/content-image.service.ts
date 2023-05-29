import { Injectable } from '@nestjs/common';
import { CreateContentImageDto } from './dto/create-content-image.dto';
import { PrismaService } from 'nestjs-prisma';
import { UploadImageBodyDto } from './dto/upload-image-body.dto';
import uploadToS3 from '@/src/utils/uploader/uploadToS3';
import resize from '@/src/utils/image/resize';
import convertToJpg from '@/src/utils/image/convertToJpg';
import { UpdateContentImageDto } from './dto/update-content-image.dto';

@Injectable()
export class ContentImageService {
  constructor(private prisma: PrismaService) {}

  create(createContentImageDto: CreateContentImageDto) {
    return this.prisma.contentImage.create({
      data: { ...createContentImageDto, type: 'ContentImage' },
    });
  }

  findAll(query: {
    pageSize: number;
    pageNumber: number;
    search: string;
    sort: string;
    order: string;
  }) {
    const skip = (Math.max(query.pageNumber, 1) - 1) * query.pageSize;
    const take = query.pageSize;

    return this.prisma.contentImage.findMany({
      where: { key: { contains: query.search, mode: 'insensitive' } },
      orderBy: {
        [query.sort]: query.order,
      },
      take,
      skip,
    });
  }

  count(query: { search: string }) {
    return this.prisma.contentImage.count({
      where: { key: { contains: query.search, mode: 'insensitive' } },
    });
  }

  findOne(key: string) {
    return this.prisma.contentImage.findUnique({ where: { key } });
  }

  async update(key: string, updateContentImageDto: UpdateContentImageDto) {
    await this.prisma.contentImage.update({
      where: { key },
      data: updateContentImageDto,
    });

    return this.prisma.contentImage.findUnique({
      where: { key: updateContentImageDto.key },
    });
  }

  remove(key: string) {
    return this.prisma.contentImage.deleteMany({ where: { key } });
  }

  async uploadImage(imageFile: any, body: UploadImageBodyDto) {
    const originalImage: Buffer = await convertToJpg(imageFile.buffer);
    body.sizes = body.sizes.map((size) => +size);
    const resizedImages = await this.resizeImagesToDifferentSizes(
      {
        buffer: originalImage,
      },
      body.sizes,
    );

    resizedImages.unshift(originalImage);

    const uploadedImages = await this.imagesUploader(
      resizedImages,
      imageFile.originalname,
    );

    return uploadedImages.map((image, index) => {
      return {
        url: image.Location,
        width: body.sizes[index - 1],
        original: index === 0,
      };
    });
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
