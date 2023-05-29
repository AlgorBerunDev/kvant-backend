import { IsString } from 'class-validator';

export class CreateContentTextDto {
  @IsString()
  key: string;

  @IsString()
  text: string;
}
