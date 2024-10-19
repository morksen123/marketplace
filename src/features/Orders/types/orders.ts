export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'CANCELLED' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED';

export interface Order {
    orderId: number;
    status: OrderStatus;
    orderTotal: number;
    createdDateTime: string;
    updatedDateTime?: string;
    trackingNo?: string;
    transactionId: number;
    buyerId: number;
    distributorId: number;
    orderLineItems: OrderLineItem[];
}

export interface OrderLineItem {
    orderLineItemId: number;
    quantity: number;
    price: number;
    productId: number;
    orderId: number;
    productName: string;
}