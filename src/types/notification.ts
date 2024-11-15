import { OrderDto } from '../features/Payment/types/payment';
import { Message } from './chat';

export interface Notification {
  notificationId: number;
  content: string;
  read: boolean;
  createdAt: string;
  distributorId: number;
  distributorNameString: string;
  buyerId: number;
  buyerNameString: string;
  messageDto?: Message;
  orderDto?: OrderDto;
  senderRole: string;
  orderStatus: string;
  productId?: string;
}
