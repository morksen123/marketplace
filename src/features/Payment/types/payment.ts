export type PaymentStatus = 'COMPLETED' | 'PENDING' | 'TRANSFERRED' | 'FAILED';
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PICKUP' | 'CANCELLED' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'REFUNDED' | 'IN_REFUND' | 'REFUND_REJECTED' | 'IN_DISPUTE';


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
  productName: string;
  orderId: number;
}

export interface OrderDto {
  buyerId: number;
  createdDateTime: string;
  distributorId: number;
  orderId: number;
  orderLineItems: OrderLineItem[];
  orderTotal: number;
  status: OrderStatus;
  trackingNo: string | null;
  transactionId: number;
  updatedDateTime: string | null;
  refundId?: number;
  disputeId?: number;
}
