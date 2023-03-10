import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IsUniqueConstraint } from '../../utils/validators/IsUniqueConstraint';
import { PrismaService } from 'nestjs-prisma';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, IsUniqueConstraint],
  exports: [UserService, IsUniqueConstraint],
})
export class UserModule {}
