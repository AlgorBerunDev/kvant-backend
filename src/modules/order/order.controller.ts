import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Post('/details')
  addOrderDetail(@Body() orderDetailDto: CreateOrderDetailDto) {
    return this.orderService.addOrderDetail(orderDetailDto);
  }

  @Put('/details/:id')
  updateOrderDetail(
    @Param('id') orderDetailId: number,
    @Body() orderDetailDto: CreateOrderDetailDto,
  ) {
    return this.orderService.updateOrderDetail(+orderDetailId, orderDetailDto);
  }

  @Delete('/details/:id')
  removeOrderDetail(@Param('id') orderDetailId: number) {
    return this.orderService.removeOrderDetail(+orderDetailId);
  }

  @Get(':id/details')
  orderDetails(@Param('id') id: number) {
    return this.orderService.orderDetails(+id);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: number) {
    return this.orderService.findAll(+userId);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.orderService.remove(+id);
  }
}
