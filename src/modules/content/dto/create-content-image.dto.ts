import { IsObject, IsString } from 'class-validator';

export class CreateContentImageDto {
  @IsString()
  key: string;

  @IsObject({ each: true })
  images: any[];
}
