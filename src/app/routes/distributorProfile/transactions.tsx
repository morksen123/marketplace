import { DistributorNavMenu } from '@/features/NavigationMenu/components/DistributorNavMenu';
import { PaymentHistory } from '@/features/Payment/components/PaymentHistory';
import { DistributorSideMenu } from '@/features/NavigationMenu/components/DistributorSideMenu';

export const TransactionsRoute = () => {
  return (
    <>
      <DistributorNavMenu />
      <div className="flex">
        <DistributorSideMenu />
        <div className="flex-1 p-8">
          <PaymentHistory />
        </div>
      </div>
    </>
  );
};
