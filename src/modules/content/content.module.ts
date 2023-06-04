import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ContentTextService } from './content-text.service';
import { ContentTextController } from './content-text.controller';
import { ContentImageController } from './content-image.controller';
import { ContentImageService } from './content-image.service';
import { ContentDataController } from './content-data.controller';
import { ContentDataService } from './content-data.service';

@Module({
  controllers: [
    ContentTextController,
    ContentImageController,
    ContentDataController,
  ],
  providers: [
    ContentTextService,
    ContentImageService,
    ContentDataService,
    PrismaService,
  ],
})
export class ContentModule {}
