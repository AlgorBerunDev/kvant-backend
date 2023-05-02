import { IsIn, IsString } from 'class-validator';
import { OrderStatus } from '../order.const';

export class UpdateOrderDto {
  @IsString()
  @IsIn([OrderStatus.Pending, OrderStatus.Confirmed, OrderStatus.Cancelled])
  status: string;
}
