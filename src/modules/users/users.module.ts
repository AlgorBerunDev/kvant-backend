import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { IsUniqueConstraint } from 'src/utils/validators/IsUniqueConstraint';
import { PrismaService } from 'nestjs-prisma';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, IsUniqueConstraint],
})
export class UsersModule {}
