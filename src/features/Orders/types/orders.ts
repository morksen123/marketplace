export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'AWAITING_PICKUP' | 'CANCELLED' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED';

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
    orderLineItems: OrderLineItem[];
    shippingAddress: string;
}

export interface OrderLineItem {
    orderLineItemId: number;
    quantity: number;
    price: number;
    productId: number;
    orderId: number;
    productName: string;
    deliveryMethod: string;
    pickUpLocation: string;
}
