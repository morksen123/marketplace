import { Product } from '@/features/ProductListing/constants';
import { del, get, post, put } from '@/lib/api-client';

interface CartDto {
  cartId: string;
  buyerId: string;
  cartLineItems: CartLineItem[];
}

export interface CartLineItem {
  cartLineItemId: string;
  price: number;
  product: Product;
  quantity: number;
  bulkPricingDiscount: number;
  promotionDiscount: number;
}

interface ImpactMetricsDto {
  weightSaved: number;
  co2Prevented: number;
  treesEquivalent: number;
  electricityDaysSaved: number;
  acNightsSaved: number;
  mealsSaved: number;
  waterLitresSaved: number;
  carKmEquivalent: number;
  showersEquivalent: number;
}

export async function viewCart(): Promise<CartDto | null> {
  const { data } = await get<CartDto>('/cart/viewCart');
  return data || null;
}

export async function addItemToCart(
  productId: string,
  quantity: number,
): Promise<CartDto | null> {
  const { data } = await post<CartDto>(
    `/cart/add?productId=${productId}&quantity=${quantity}`,
    {},
  );

  return data || null;
}

export async function updateItemQuantity(
  productId: string,
  newQuantity: number,
) {
  await put<CartDto>(
    `/cart/update?productId=${productId}&newQuantity=${newQuantity}`,
    {},
  );
}

export async function removeItemFromCart(productId: string) {
  await del<string>(`/cart/delete?productId=${productId}`);
}

export async function createTransaction(paymentIntentId: string) {
  await post(`/cart/create-transaction?paymentIntentId=${paymentIntentId}`, {});
}

export async function calculateCartImpact(): Promise<ImpactMetricsDto | null> {
  const { data } = await get<ImpactMetricsDto>('/cart/calculate-impact');
  return data || null;
}

