import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { INestApplication } from '@nestjs/common';

import { AppController } from '../../app.controller';
import { AppService } from '../../app.service';
import { PrismaClientExceptionFilter, PrismaModule } from '../../lib/prisma';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';
import { UserModule } from '../user/user.module';
import { PrismaService } from 'nestjs-prisma';
import { AuthModule } from './auth.module';
import { UserService } from '../user/user.service';
import { UserCreateInput } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let app: INestApplication;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule.forRoot({ isGlobal: true }),
        UserModule,
        AuthModule,
      ],
      controllers: [AppController],
      providers: [
        PrismaService,
        AppService,
        {
          provide: APP_FILTER,
          useFactory: ({ httpAdapter }: HttpAdapterHost) => {
            return new PrismaClientExceptionFilter(httpAdapter);
          },
          inject: [HttpAdapterHost],
        },
      ],
    }).compile();

    const prisma = module.get<PrismaService>(PrismaService);

    const tableNames = await prisma.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    const tables = tableNames
      .map(({ tablename }) => tablename)
      .filter((name) => name !== '_prisma_migrations')
      .map((name) => `"public"."${name}"`)
      .join(', ');

    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    } catch (error) {
      console.log({ error });
    }

    app = module.createNestApplication();
    app.init();
    controller = module.get<AuthController>(AuthController);
    userService = module.get<UserService>(UserService);
    await userService.create({
      username: 'admin',
      name: 'admin',
      password: 'admin',
      email: 'admin@example.com',
    });
  });

  it('should be defined', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .set('Content-type', 'application/json')
      .send({ username: 'admin', password: 'admin' })
      .expect(201);
  });
});
