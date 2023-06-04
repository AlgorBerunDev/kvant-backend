import { Category } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsInt,
  ValidateNested,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CategoryDto implements Category {
  @IsInt()
  @IsOptional()
  parentId: number | null;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsObject()
  @IsOptional()
  icon: any;

  @IsObject()
  @IsOptional()
  image: any;
}
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  detail: string;

  @IsNotEmpty()
  @Min(0)
  @IsNumber()
  price: number;

  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  @IsNotEmpty()
  categories: Category[];
}
