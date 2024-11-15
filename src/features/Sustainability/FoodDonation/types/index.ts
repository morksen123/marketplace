export type FoodDonationType = 'COMPOSTE' | 'BIOGAS' | 'UPCYCLING';

export interface FoodDonation {
    foodDonationId: number;
    createdOn: string;
    distributor: {
        distributorId: number;
        name: string;
    };
    batch: {
        batchId: number;
        batchNumber: string;
    };
    product: {
        productId: number;
        name: string;
    };
    quantity: number;
    weight: number;
    foodDonationType: FoodDonationType;
}
