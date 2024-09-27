export interface Promotion {
    promotionId: number; 
    promotionName: string;
    description: string;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
    productIds: number[]; // array of product IDs
    distributorId: number; // null if created by admin
}