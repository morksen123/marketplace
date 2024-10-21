import { Message } from "./chat";
import { OrderDto } from "../features/Payment/types/payment";

export interface Notification {
    notificationId: number;
    content: string;
    isRead: boolean;
    createdAt: string;
    distributorId: number;
    distributorNameString: string;
    buyerId: number;
    buyerNameString: string;
    messageDto?: Message;
    orderDto?: OrderDto;
    senderRole: string;
}
