import { IsObject, IsString } from 'class-validator';

export class CreateContentDataDto {
  @IsString()
  key: string;

  @IsObject()
  data: any;
}
