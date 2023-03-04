// src/articles/dto/create-article.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: false })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  username: string;
}
