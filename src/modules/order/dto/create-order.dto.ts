import { IsExist } from '@/src/utils/validators/IsExist';
import { IsInt, IsNotEmpty, Validate } from 'class-validator';

export class CreateOrderDto {
  @Validate(IsExist, ['user', 'id'])
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
