import { IsIn, IsString, IsInt, IsOptional } from 'class-validator';
import { OrderDeliveryMethod, OrderStatus } from '../order.const';

export class UpdateOrderDto {
  @IsString()
  @IsIn([OrderStatus.Pending, OrderStatus.Confirmed, OrderStatus.Cancelled])
  status: string;

  @IsInt()
  @IsIn([
    OrderDeliveryMethod.Delivery,
    OrderDeliveryMethod.NotSelected,
    OrderDeliveryMethod.Pickup,
  ])
  @IsOptional()
  deliveryMethod: number;
}
