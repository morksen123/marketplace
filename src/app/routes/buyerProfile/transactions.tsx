import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';
import { PaymentHistory } from '@/features/Payment/payment-history';

export const TransactionsRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <PaymentHistory />
    </>
  );
};
