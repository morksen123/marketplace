export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PICKUP'
  | 'CANCELLED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED';

export interface Order {
  orderId: number;
  status: OrderStatus;
  orderTotal: number;
  createdDateTime: string;
  updatedDateTime?: string;
  trackingNo?: string;
  transactionId: number;
  buyerId: number;
  buyerEmail: string;
  distributorId: number;
  distributorName: string;
  orderFees: number;
  orderLineItems: OrderLineItem[];
  shippingAddress: ShippingAddress;
  pickUpLocation: string;
  reviewNeeded: boolean;
}

export interface OrderLineItem {
  orderLineItem: number;
  quantity: number;
  price: number;
  productId: number;
  orderId: number;
  productName: string;
  deliveryMethod: string;
  pickUpLocation: string;
}

export interface ShippingAddress {
  shippingAddressId: number;
  label: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
}
