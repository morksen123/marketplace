export type PaymentStatus = 'COMPLETED' | 'PENDING' | 'TRANSFERRED' | 'FAILED';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Transaction {
  id: number;
  date: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'TRANSFERRED' | 'FAILED';
  createdDateTime: string;
  orderItems?: OrderItem[];
  paymentIntentId?: string;
  applicationFee?: string;
  shippingDetails?: {
    city: string;
    country: string;
    line1: string;
    line2: string;
    name: string;
    postalCode: string;
    state?: string;
  };
}
