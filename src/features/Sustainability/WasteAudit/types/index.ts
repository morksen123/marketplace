export interface WasteMetrics {
    totalWastePrevented: number; // in kg
    monthlyWastePrevention: {
      month: string;
      wastePrevented: number;
    }[];
    categoryBreakdown: {
      category: string;
      wastePrevented: number;
      percentageOfTotal: number;
    }[];
  }
  
export interface WasteRecommendation {
    productId: number;
    productName: string;
    recommendationType: 'URGENT_ACTION' | 'WARNING' | 'OPTIMIZATION';
    recommendationText: string;
    potentialWastePrevention: number; // in kg
    currentStock: number;
    daysToExpiry: number;
  }
  
export interface WasteAuditData extends WasteMetrics {
    recommendations: WasteRecommendation[];
  }