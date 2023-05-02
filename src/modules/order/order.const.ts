export const OrderStatus = {
  InCart: 'in-cart',
  Pending: 'pending',
  Confirmed: 'confirmed',
  Shipped: 'shipped',
  Delivered: 'delivered',
  Cancelled: 'cancelled',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
