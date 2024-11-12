import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';
import { BuyerSideMenu } from '@/features/NavigationMenu/components/BuyerSideMenu';
import { BuyerDisputesPage } from '@/features/Disputes/pages/BuyerDisputesPage';

export const BuyerDisputesRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <div className="flex">
        <BuyerSideMenu />
        <div className="flex-1 p-8">
          <BuyerDisputesPage />
        </div>
      </div>
    </>
  );
};
