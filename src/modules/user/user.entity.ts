// src/articles/entities/article.entity.ts

import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  contact: string;

  @ApiProperty({ type: String, required: true })
  username: string;

  @ApiProperty({ type: String })
  password: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
