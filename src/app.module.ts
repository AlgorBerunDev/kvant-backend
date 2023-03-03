import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaClientExceptionFilter, PrismaModule } from './lib/prisma';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';
import { PrismaService } from 'nestjs-prisma';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [PrismaModule.forRoot(), UsersModule],
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
})
export class AppModule {}
