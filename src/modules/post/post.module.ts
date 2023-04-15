import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from 'nestjs-prisma';
import { IsUniqueConstraint } from '@utils/validators/IsUniqueConstraint';
import { IsExist } from '@utils/validators/IsExist';

@Module({
  controllers: [PostController],
  providers: [PostService, PrismaService, IsUniqueConstraint, IsExist],
  exports: [PostService, IsUniqueConstraint, IsExist],
})
export class PostModule {}
