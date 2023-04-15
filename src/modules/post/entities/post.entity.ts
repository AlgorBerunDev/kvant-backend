import { Post } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
export class PostEntity implements Post {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String, required: true })
  content: string;

  @ApiProperty({ type: Boolean, default: false })
  published: boolean;

  @ApiProperty({ type: String })
  author: string;

  @ApiProperty({ type: Number })
  authorId: number;
}
