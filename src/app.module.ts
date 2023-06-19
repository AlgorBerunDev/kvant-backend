import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaClientExceptionFilter, PrismaModule } from './lib/prisma';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';
import { UserModule } from './modules/user/user.module';
import { PrismaService } from 'nestjs-prisma';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { CategoryModule } from './modules/category/category.module';
import { ContentModule } from './modules/content/content.module';
import { PaymentsModule } from './modules/payments/payments.module';
import * as path from 'path';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';

@Module({
  imports: [
    PrismaModule.forRoot({ isGlobal: true }),
    I18nModule.forRootAsync({
      resolvers: [AcceptLanguageResolver],
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: path.join(__dirname, '..', 'i18n'),
          watch: true,
        },
        logging: true,
      }),
    }),
    UserModule,
    AuthModule,
    ProductModule,
    OrderModule,
    CategoryModule,
    ContentModule,
    PaymentsModule,
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
})
export class AppModule {}
