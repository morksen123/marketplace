export type RefundStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Refund {
    refundId: number;
    stripeRefundId?: string;
    amount: number;
    createdDateTime: string;
    completedDateTime?: string;
    refundReason?: string;
    refundStatus: RefundStatus;
    transactionId: number;
    orderId: number;
}