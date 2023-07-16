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
import axios from 'axios';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const created = await this.prisma.order.create({
      data: { ...createOrderDto, status: OrderStatus.InCart },
    });
    await axios({
      url: 'https://click.fibro.uz/api/order',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        original_id: created.id,
        total_price: 0,
        original_created_at: created.createdAt,
        original_updated_at: created.updatedAt,
      },
    });
    return created;
  }

  async addOrderDetail(orderDetailDto: CreateOrderDetailDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: orderDetailDto.productId },
    });

    const addOrderDetail = await this.prisma.orderDetail.create({
      data: { ...orderDetailDto, price: product.price },
    });
    await this.updateRemoteOrder(addOrderDetail.orderId);
    return addOrderDetail;
  }

  async updateOrderStatus(orderStatusDto: { status: string; id: number }) {
    return this.prisma.order.update({
      where: { id: +orderStatusDto.id },
      data: { status: orderStatusDto.status },
    });
  }
  async updateRemoteOrder(orderId) {
    const order = await this.prisma.order.findFirst({ where: { id: orderId } });
    const allOrderDetails = await this.prisma.orderDetail.findMany({
      where: { orderId: orderId },
    });

    let sum = 0;
    allOrderDetails.forEach((orderDetail) => {
      sum = sum + orderDetail.price * orderDetail.quantity;
    });

    try {
      await axios({
        url: 'https://click.fibro.uz/api/order/' + orderId,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          original_id: orderId,
          total_price: sum,
          original_created_at: order.createdAt,
          original_updated_at: order.updatedAt,
        },
      });
    } catch (e) {
      console.log(e);
    }

    return sum;
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

    const updatedOrderDetail = await this.prisma.orderDetail.update({
      where: { id: orderDetailId },
      data: orderDetailDto,
    });

    await this.updateRemoteOrder(updatedOrderDetail.orderId);
    return updatedOrderDetail;
  }

  async removeOrderDetail(orderDetailId: number) {
    const orderDetail = await this.prisma.orderDetail.findFirst({
      where: { id: orderDetailId },
    });

    const removedOrderDetail = await this.prisma.orderDetail.deleteMany({
      where: { id: orderDetailId },
    });

    await this.updateRemoteOrder(orderDetail.orderId);

    return removedOrderDetail;
  }

  orderDetails(id: number) {
    return this.prisma.orderDetail.findMany({
      where: { orderId: id },
      include: {
        product: { include: { images: true } },
        order: { include: { user: true } },
      },
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
