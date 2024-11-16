import { get, post } from '@/lib/api-client';
import { FoodDonationType, Batch } from '../types';

export async function getExpiringBatches() {
  const { data } = await get<Batch[]>('/distributor/batches');
  return data;
}

export async function processDonation(batchId: string, foodDonationType: FoodDonationType) {
  await post(`/distributor/food-donations`, {
    batchId,
    foodDonationType,
  });
}