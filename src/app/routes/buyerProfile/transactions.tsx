import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';
import { PaymentHistory } from '@/features/Payment/components/PaymentHistory';
import { BuyerSideMenu } from "@/features/NavigationMenu/components/BuyerSideMenu";

export const TransactionsRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <div className="flex">
        <BuyerSideMenu />
        <div className="flex-1 p-8">
          <PaymentHistory />
        </div>
      </div>
    </>
  );
};
