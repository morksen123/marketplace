import { post } from './api-client';

export async function triggerProductClickEvent(productId: string) {
  await post(`/analytics/${productId}/increment-clicks`, {});
}

export async function productViewEvent(productId: number) {
  await post(`/analytics/${productId}/increment-views`, {});
}
