import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(user: CreateUserDto): Promise<User> {
    const data = user as User;
    return this.prisma.user.create({ data: { ...data, role: 'public' } });
  }

  users() {
    return this.prisma.user.findMany();
  }

  user(userId: number) {
    return this.prisma.user.findFirstOrThrow({
      where: { id: userId },
    });
  }

  findByIdentity(identity: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { contact: identity } });
  }

  async isAdmin(username) {
    const user = await this.prisma.user.findFirst({ where: { username } });
    return user.role === 'admin';
  }
}
