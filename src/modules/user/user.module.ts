import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IsUniqueConstraint } from '../../utils/validators/IsUniqueConstraint';
import { PrismaService } from 'nestjs-prisma';
import { IsExist } from '@/src/utils/validators/IsExist';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, IsUniqueConstraint, IsExist],
  exports: [UserService, IsUniqueConstraint, IsExist],
})
export class UserModule {}
