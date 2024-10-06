import { ROLES, RoleTypes } from '@/features/Authentication/types/auth';
import { get } from '@/lib/api-client';
import { Transaction } from '../types/payment';

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
