import { DistributorNavMenu } from '@/features/NavigationMenu/components/DistributorNavMenu';
import { PaymentHistory } from '@/features/Payment/components/PaymentHistory';

export const TransactionsRoute = () => {
  return (
    <>
      <DistributorNavMenu />
      <PaymentHistory />
    </>
  );
};
