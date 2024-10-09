export type PaymentStatus = 'COMPLETED' | 'PENDING' | 'TRANSFERRED' | 'FAILED';

export interface Transaction {
  amount: number;
  applicationFee: number;
  buyerId: number;
  currency: string;
  id: number;
  status: PaymentStatus;
  createdDateTime: string;
  orderIds: number[];
  distributorAmountMapping: { [key: number]: number };
  paymentIntentId: string;
  shippingDetails?: {
    city?: string;
    country: string;
    line1: string;
    line2: string;
    name: string;
    postalCode: string;
    state?: string;
  };
}

interface OrderLineItem {
  orderLineItemId: number;
  quantity: number;
  price: number;
  productId: number;
  orderId: number;
}

export interface OrderDto {
  buyerId: number;
  createdDateTime: string;
  distributorId: number;
  orderId: number;
  orderLineItems: OrderLineItem[];
  orderTotal: number;
  status: string;
  trackingNo: string | null;
  transactionId: number;
  updatedDateTime: string | null;
}
