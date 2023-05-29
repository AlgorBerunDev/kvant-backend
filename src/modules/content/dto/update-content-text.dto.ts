import { IsString } from 'class-validator';

export class UpdateContentTextDto {
  @IsString()
  key: string;

  @IsString()
  text: string;
}
