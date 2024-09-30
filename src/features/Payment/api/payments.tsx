import { ROLES, RoleTypes } from '@/features/Authentication/types/auth';
import { get } from '@/lib/api-client';

export async function getUserTransactions(role: RoleTypes) {
  const endpoint =
    role === ROLES.BUYER ? '/buyer/transactions' : '/distributor/transactions';

  const { data } = await get(endpoint);
  return data;
}
