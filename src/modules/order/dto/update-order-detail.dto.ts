import { IsExist } from '@/src/utils/validators/IsExist';
import { IsInt, IsNotEmpty, IsNumber, Validate } from 'class-validator';

export class UpdateOrderDetailDto {
  @Validate(IsExist, ['order', 'id'])
  @IsInt()
  @IsNotEmpty()
  orderId: number;

  @Validate(IsExist, ['product', 'id'])
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
