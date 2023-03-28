import { PrismaModule, PrismaClientExceptionFilter } from '@/src/lib/prisma';
import { ModuleMetadata } from '@nestjs/common';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';

export async function createTestingModule(
  metadata: ModuleMetadata,
): Promise<TestingModule> {
  const module: TestingModule = await Test.createTestingModule({
    imports: [PrismaModule.forRoot({ isGlobal: true }), ...metadata.imports],
    controllers: metadata.controllers,
    providers: [
      PrismaService,
      {
        provide: APP_FILTER,
        useFactory: ({ httpAdapter }: HttpAdapterHost) => {
          return new PrismaClientExceptionFilter(httpAdapter);
        },
        inject: [HttpAdapterHost],
      },
    ],
  }).compile();

  return module;
}

// export function clearDB() {}
// export function seed() {}
