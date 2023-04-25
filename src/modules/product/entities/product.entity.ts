import { Prisma } from '@prisma/client';

export class Product implements Prisma.ProductUncheckedCreateInput {
  id?: number;
  name: string;
  description: string;
  price: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  orderDetails?: Prisma.OrderDetailUncheckedCreateNestedManyWithoutProductInput;
}
