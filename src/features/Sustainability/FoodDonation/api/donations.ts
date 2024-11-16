import { get } from '@/lib/api-client';
import { FoodDonationStats } from '../types';

export async function fetchFoodDonationStats(distributorId?: number) {
  try {
    // Make sure distributorId is a number and valid
    const endpoint = distributorId && !isNaN(Number(distributorId))
      ? `/distributor/food-donations/stats/${Number(distributorId)}`
      : '/distributor/food-donations/stats';
    
    const { data } = await get<FoodDonationStats>(endpoint);
    return data;
  } catch (error) {
    console.error('Error fetching food donation stats:', error);
    // Return default empty stats
    return {
      totalDonationsByType: {
        COMPOSTE: 0,
        BIOGAS: 0,
        UPCYCLING: 0
      },
      distributorDonationsByType: {
        COMPOSTE: 0,
        BIOGAS: 0,
        UPCYCLING: 0
      }
    };
  }
}
