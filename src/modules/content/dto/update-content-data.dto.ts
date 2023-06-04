import { IsObject, IsString } from 'class-validator';

export class UpdateContentDataDto {
  @IsString()
  key: string;

  @IsObject()
  data: any;
}
