import { IsNumberString, IsString } from 'class-validator';

export class UploadImageBodyDto {
  @IsString()
  imageId: string;

  @IsNumberString({}, { each: true })
  sizes: number[];
}
