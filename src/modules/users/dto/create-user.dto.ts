// src/articles/dto/create-article.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, Validate } from 'class-validator';
import { IsUniqueConstraint } from 'src/utils/validators/IsUniqueConstraint';

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
  @Validate(IsUniqueConstraint, ['user', 'username'])
  @ApiProperty({ required: false })
  username: string;
}
