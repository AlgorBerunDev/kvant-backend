import { IsExist } from '@utils/validators/IsExist';
import { IsUniqueConstraint } from '@utils/validators/IsUniqueConstraint';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @Validate(IsUniqueConstraint, ['post', 'title'])
  @ApiProperty({ type: String, required: true })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  content: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ type: Boolean, default: false })
  published: boolean;

  @Validate(IsExist, ['user', 'id'])
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true })
  authorId: number;
}
