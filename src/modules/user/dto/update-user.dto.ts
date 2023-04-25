// src/articles/dto/create-article.dto.ts

import { IsUniqueConstraint } from '@/src/utils/validators/IsUniqueConstraint';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Validate } from 'class-validator';

export class UpdateUserDto {
  @Validate(IsUniqueConstraint, ['user', 'contact'])
  @IsString()
  @IsOptional()
  @ApiProperty({ required: true })
  contact: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: true })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  username: string;
}
