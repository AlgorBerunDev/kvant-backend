// src/articles/dto/create-article.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, Validate } from 'class-validator';
import { IsUniqueConstraint } from '../../../utils/validators/IsUniqueConstraint';

export class CreateUserDto {
  @Validate(IsUniqueConstraint, ['user', 'contact'])
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+998\d{9}$/)
  @ApiProperty({ required: true })
  contact: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  username: string;
}
