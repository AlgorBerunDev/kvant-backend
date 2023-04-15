import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  create(post: CreatePostDto): Promise<Post> {
    return this.prisma.post.create({ data: post as Post });
  }

  posts() {
    return this.prisma.user.findMany();
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({ where: { id }, data: updatePostDto });
  }

  findAll() {
    return this.prisma.post.findMany({
      include: {
        author: { select: { id: true, email: true, username: true } },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.post.findFirst({ where: { id } });
  }

  remove(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }
}
