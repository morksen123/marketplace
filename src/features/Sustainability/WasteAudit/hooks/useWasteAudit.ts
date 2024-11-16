import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchDashboardData } from '@/features/Payment/api/sales';
import { getAllProductsByDistributor } from '@/features/DIstributorAccount/lib/distributor';
import { WasteMetrics, WasteRecommendation } from '../types';
import { fetchFoodDonationStats } from '@/features/Sustainability/FoodDonation/api/donations';

const WASTE_PREVENTION_FACTOR = 0.5;
const URGENT_ACTION_DAYS = 3;
const WARNING_DAYS = 7;

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
  const { data: salesData, isLoading: isSalesLoading, error: salesError } = useQuery({
    queryKey: ['sales'],
    queryFn: () => fetchDashboardData(),
  });

  const { data: inventoryData, isLoading: isInventoryLoading, error: inventoryError } = useQuery({
    queryKey: ['distributorProducts'],
    queryFn: getAllProductsByDistributor,
  });

  const { data: donationStats, isLoading: isDonationLoading, error: donationError } = useQuery({
    queryKey: ['foodDonationStats'],
    queryFn: () => fetchFoodDonationStats(),
  });

  // Memoize waste metrics calculation
  const wasteMetrics = useMemo(() => {
    if (!salesData || !donationStats) return null;
    
    return {
      totalWastePrevented: salesData.totalUnitsSold * WASTE_PREVENTION_FACTOR,
      monthlyWastePrevention: salesData.monthlySales.map(month => ({
        month: month.name,
        wastePrevented: month.sales * WASTE_PREVENTION_FACTOR
      })),
      categoryBreakdown: calculateCategoryBreakdown(salesData, WASTE_PREVENTION_FACTOR),
      donationStats: {
        distributorDonationsByType: donationStats.distributorDonationsByType,
        totalDonated: Object.values(donationStats.distributorDonationsByType).reduce((a, b) => a + b, 0)
      }
    };
  }, [salesData, donationStats]);

  // Memoize recommendations calculation
  const recommendations = useMemo(() => {
    if (!inventoryData?.data) return [];

    return inventoryData.data
      .flatMap(product => {
        const recommendations: WasteRecommendation[] = [];
        
        if (product.batches) {
          product.batches
            .filter(batch => batch.isActive) // Only consider active batches
            .forEach(batch => {
              const daysToExpiry = calculateDaysToExpiry(batch.bestBeforeDate);
              
              if (daysToExpiry <= URGENT_ACTION_DAYS) {
                recommendations.push({
                  productId: product.productId,
                  productName: product.listingTitle,
                  recommendationType: 'URGENT_ACTION',
                  recommendationText: `Consider immediate promotional pricing for ${product.listingTitle}. Stock expires in ${daysToExpiry} days.`,
                  potentialWastePrevention: batch.quantity * WASTE_PREVENTION_FACTOR,
                  currentStock: batch.quantity,
                  daysToExpiry
                });
              } else if (daysToExpiry <= WARNING_DAYS) {
                recommendations.push({
                  productId: product.productId,
                  productName: product.listingTitle,
                  recommendationType: 'WARNING',
                  recommendationText: `Monitor ${product.listingTitle} closely. Stock expires in ${daysToExpiry} days.`,
                  potentialWastePrevention: batch.quantity * WASTE_PREVENTION_FACTOR,
                  currentStock: batch.quantity,
                  daysToExpiry
                });
              }
            });
        }
        
        return recommendations;
      })
      .sort((a, b) => a.daysToExpiry - b.daysToExpiry);
  }, [inventoryData]);

  const error = salesError || inventoryError || donationError;

  return {
    wasteMetrics,
    recommendations,
    isLoading: isSalesLoading || isInventoryLoading || isDonationLoading,
    error
  };
}
