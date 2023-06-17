import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from 'nestjs-prisma';
import { IsFieldEmpty } from '@/src/utils/validators/IsFieldEmpty';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService, IsFieldEmpty],
})
export class CategoryModule {}
