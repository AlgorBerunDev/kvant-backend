import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ContentTextService } from './content-text.service';
import { ContentTextController } from './content-text.controller';
import { ContentImageController } from './content-image.controller';
import { ContentImageService } from './content-image.service';

@Module({
  controllers: [ContentTextController, ContentImageController],
  providers: [ContentTextService, ContentImageService, PrismaService],
})
export class ContentModule {}
