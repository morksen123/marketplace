import { getUserRoleFromCookie } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getTransaction, getUserTransactions } from '../api/payments';
import { Transaction } from '../types/payment';

export const usePayments = (transactionId?: number) => {
  const role = getUserRoleFromCookie();
  const transactionQuery = useQuery<Transaction | null>({
    queryKey: ['transaction', transactionId],
    queryFn: () => (transactionId ? getTransaction(transactionId) : null),
    enabled: !!transactionId,
  });

  const userTransactionsQuery = useQuery({
    queryKey: ['userTransactions', role],
    queryFn: () => (role ? getUserTransactions(role) : []),
    enabled: !!role,
  });

  return { transactionQuery, userTransactionsQuery };
};
