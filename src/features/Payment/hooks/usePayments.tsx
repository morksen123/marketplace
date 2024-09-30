import { RoleTypes } from '@/features/Authentication/types/auth';
import { useQuery } from '@tanstack/react-query';
import { getUserTransactions } from '../api/payments';

interface UsePaymentsProps {
  role: RoleTypes;
}

export const usePayments = ({ role }: UsePaymentsProps) => {
  const userTransactionsQuery = useQuery({
    queryKey: ['userTransactions', role],
    queryFn: () => getUserTransactions(role),
    enabled: !!role,
  });

  // Add other payment-related hooks or logic here if needed

  return {
    userTransactions: userTransactionsQuery,
    // Other payment-related queries or mutations can go here
  };
};
