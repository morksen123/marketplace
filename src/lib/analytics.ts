import { post } from './api-client';

export async function triggerProductClickEvent(productId: string) {
  await post(`/analytics/${productId}/increment-clicks`, {});
}
