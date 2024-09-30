import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';
import { PaymentHistory } from '@/features/Payment/components/PaymentHistory';

export const TransactionsRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <PaymentHistory />
    </>
  );
};
