import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '@/features/Payment/api/sales';
import { getAllProductsByDistributor } from '@/features/DIstributorAccount/lib/distributor';
import { WasteMetrics, WasteRecommendation } from '../types';

// Helper function to calculate days until expiry
const calculateDaysToExpiry = (bestBeforeDate: string): number => {
  const today = new Date();
  const expiryDate = new Date(bestBeforeDate);
  const diffTime = expiryDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper function to calculate category breakdown
const calculateCategoryBreakdown = (salesData: any, wastePreventionFactor: number) => {
  const categoryMap = new Map<string, number>();
  let total = 0;

  salesData.topThreeProducts.forEach((product: any) => {
    const wastePrevented = product.unitsSold * wastePreventionFactor;
    categoryMap.set(product.productName, wastePrevented);
    total += wastePrevented;
  });

  return Array.from(categoryMap.entries()).map(([category, wastePrevented]) => ({
    category,
    wastePrevented,
    percentageOfTotal: (wastePrevented / total) * 100
  }));
};

export function useWasteAudit() {
  const { data: salesData, isLoading: isSalesLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: () => fetchDashboardData(),
  });

  const { data: inventoryData, isLoading: isInventoryLoading } = useQuery({
    queryKey: ['distributorProducts'],
    queryFn: getAllProductsByDistributor,
  });

  // Calculate waste metrics
  const calculateWasteMetrics = (): WasteMetrics | null => {
    if (!salesData) return null;

    // Assuming each unit sold prevents 0.5kg of waste (adjust as needed)
    const wastePreventionFactor = 0.5;
    
    return {
      totalWastePrevented: salesData.totalUnitsSold * wastePreventionFactor,
      monthlyWastePrevention: salesData.monthlySales.map(month => ({
        month: month.name,
        wastePrevented: month.sales * wastePreventionFactor
      })),
      categoryBreakdown: calculateCategoryBreakdown(salesData, wastePreventionFactor)
    };
  };

  // Generate smart recommendations
  const generateRecommendations = (): WasteRecommendation[] => {
    if (!inventoryData?.data) return [];

    return inventoryData.data
      .flatMap(product => {
        const recommendations: WasteRecommendation[] = [];
        
        if (product.batches) {
          product.batches.forEach(batch => {
            const daysToExpiry = calculateDaysToExpiry(batch.bestBeforeDate);
            
            if (daysToExpiry <= 3) {
              recommendations.push({
                productId: product.productId,
                productName: product.listingTitle,
                recommendationType: 'URGENT_ACTION',
                recommendationText: `Consider immediate promotional pricing for ${product.listingTitle}. Stock expires in ${daysToExpiry} days.`,
                potentialWastePrevention: batch.quantity * 0.5,
                currentStock: batch.quantity,
                daysToExpiry
              });
            } else if (daysToExpiry <= 7) {
              recommendations.push({
                productId: product.productId,
                productName: product.listingTitle,
                recommendationType: 'WARNING',
                recommendationText: `Monitor ${product.listingTitle} closely. Stock expires in ${daysToExpiry} days.`,
                potentialWastePrevention: batch.quantity * 0.5,
                currentStock: batch.quantity,
                daysToExpiry
              });
            }
          });
        }
        
        return recommendations;
      })
      .sort((a, b) => a.daysToExpiry - b.daysToExpiry);
  };

  return {
    wasteMetrics: calculateWasteMetrics(),
    recommendations: generateRecommendations(),
    isLoading: isSalesLoading || isInventoryLoading
  };
}
