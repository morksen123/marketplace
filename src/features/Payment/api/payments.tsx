import { ROLES, RoleTypes } from '@/features/Authentication/types/auth';
import { get, post } from '@/lib/api-client';
import { OrderDto, Transaction } from '../types/payment';

export async function getUserTransactions(role: RoleTypes) {
  const endpoint =
    role === ROLES.BUYER ? '/buyer/transactions' : '/distributor/transactions';

  const { data } = await get(endpoint);
  return data;
}

export async function getTransaction(
  transactionId: number,
): Promise<Transaction | null> {
  const { data } = await get<Transaction>(
    `/payments/get-transaction?transactionId=${transactionId}`,
  );
  return data || null;
}

export async function getOrderDetails(
  orderIds: number[],
): Promise<OrderDto[] | null> {
  const { data } = await post<OrderDto[]>('/buyer/orders/multiple', {
    orderIds,
  });
  return data;
}
