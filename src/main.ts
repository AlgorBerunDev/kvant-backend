import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationError, useContainer } from 'class-validator';
import * as dotenv from 'dotenv';
import { I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'production')
    app.enableCors({
      allowedHeaders: [
        'origin',
        'x-requested-with',
        'content-type',
        'accept',
        'authorization',
      ],
      credentials: true,
      origin: [
        process.env.AUTHORITY,
        process.env.PUBLIC_DOMEN,
        'http://kvant.uz',
        'https://kvant-admin.fibro.uz',
        'https://admin.kvant.uz',
        'https://kvant.fibro.uz',
        'https://api.fibro.uz',
      ],
    });

  if (process.env.NODE_ENV === 'development')
    app.enableCors({
      allowedHeaders: [
        'origin',
        'x-requested-with',
        'content-type',
        'accept',
        'authorization',
      ],
      origin: 'http://localhost:3028',
      credentials: true,
    });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((error) => ({
            value: error.value,
            property: error.property,
            children: error.children,
            constraints: error.constraints,
          })),
        );
      },
    }),
    new I18nValidationPipe(),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('Swagger Example API')
    .setDescription('This is a description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT || 3000;
  await app.listen(+port);
}
bootstrap();
