import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './order.const';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: { ...createOrderDto, status: OrderStatus.InCart },
    });
  }

  async addOrderDetail(orderDetailDto: CreateOrderDetailDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: orderDetailDto.productId },
    });

    return this.prisma.orderDetail.create({
      data: { ...orderDetailDto, price: product.price },
    });
  }

  async updateOrderDetail(
    orderDetailId: number,
    orderDetailDto: UpdateOrderDetailDto,
  ) {
    const orderDetail = await this.prisma.orderDetail.findUnique({
      where: { id: orderDetailId },
    });

    if (!orderDetail) {
      throw new NotFoundException();
    }

    return await this.prisma.orderDetail.update({
      where: { id: orderDetailId },
      data: orderDetailDto,
    });
  }

  removeOrderDetail(orderDetailId: number) {
    return this.prisma.orderDetail.deleteMany({ where: { id: orderDetailId } });
  }

  orderDetails(id: number) {
    return this.prisma.orderDetail.findMany({
      where: { orderId: id },
      include: { product: { include: { images: true } } },
    });
  }

  findAll(userId: number) {
    return this.prisma.order.findMany({ where: { userId: userId } });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({ where: { id }, data: updateOrderDto });
  }

  async remove(id: number) {
    try {
      return await this.prisma.order.deleteMany({ where: { id } });
    } catch (error) {
      throw new UnprocessableEntityException(
        'Cannot delete order because it is associated with other records. Please remove any associated records before deleting this order.',
      );
    }
  }
}
