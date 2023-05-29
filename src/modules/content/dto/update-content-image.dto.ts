import { IsObject, IsString } from 'class-validator';

export class UpdateContentImageDto {
  @IsString()
  key: string;

  @IsObject({ each: true })
  images: any[];
}
