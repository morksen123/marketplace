export interface WasteMetrics {
    totalWastePrevented: number;
    monthlyWastePrevention: {
      month: string;
      wastePrevented: number;
    }[];
    categoryBreakdown: {
      category: string;
      wastePrevented: number;
      percentageOfTotal: number;
    }[];
    donationStats: {
      distributorDonationsByType: {
        COMPOSTE: number;
        BIOGAS: number;
        UPCYCLING: number;
      };
      totalDonated: number;
    };
}
  
export type WasteRecommendationType = 'URGENT_ACTION' | 'WARNING' | 'OPTIMIZATION';
  
export interface WasteRecommendation {
    productId: number;
    productName: string;
    recommendationType: WasteRecommendationType;
    recommendationText: string;
    potentialWastePrevention: number; // in kg
    currentStock: number;
    daysToExpiry: number;
  }
  
export interface WasteAuditData extends WasteMetrics {
    recommendations: WasteRecommendation[];
  }