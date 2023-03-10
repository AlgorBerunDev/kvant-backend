import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
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

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(appController.users()).toBe('Hello World!');
    });
  });
});
