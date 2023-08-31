export const OrderStatus = {
  InCart: 'in-cart',
  Pending: 'pending',
  Confirmed: 'confirmed',
  Shipped: 'shipped',
  Delivered: 'delivered',
  Cancelled: 'cancelled',
} as const;

export const OrderDeliveryMethod = {
  NotSelected: 0,
  Delivery: 1,
  Pickup: 2,
};

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
