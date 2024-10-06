export interface Promotion {
    promotionId: number; 
    promotionName: string;
    description: string;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'NOT_STARTED';
    productIds: number[]; // array of product IDs
    distributorId: number; // null if created by admin
}