export type FoodDonationType = 'COMPOSTE' | 'BIOGAS' | 'UPCYCLING';

export interface Batch {
    batchId: number;
    bestBeforeDate: string;
    quantity: number;
    isActive: boolean;
    productId: number;
    productName: string;
    createdOn: string;
    weight: number;
}

export interface FoodDonationStats {
    totalDonationsByType: Record<FoodDonationType, number>;
    distributorDonationsByType: Record<FoodDonationType, number>;
}