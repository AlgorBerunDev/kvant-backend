import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationError, useContainer } from 'class-validator';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  const corsOptions = {
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
      'https://kvant-admin.fibro.uz',
      'http://locahost:3028',
      'http://locahost:3001',
    ],
  };
  // app.use(
  //   CorsMiddleware({
  //     origin: [

  //     ],
  //   }),
  // );
  app.enableCors(corsOptions);
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
