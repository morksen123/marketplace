export type CircularEcononomyType = 'COMPOSTING' | 'BIOGAS_GENERATION' | 'FOOD_UPCYCLING';

export interface CircularAllocation {
    allocationId: number;
    productId: number;
    batchId: number;
    quantity: number;
    circularEconomyType: CircularEcononomyType;
    createdDateTime: string;
}
