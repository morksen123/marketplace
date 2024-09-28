import BuyerAccountDeactivation from '@/features/BuyerAccount/components/BuyerAccountDeactivation';
import { BuyerNavMenu } from "@/features/NavigationMenu/components/BuyerNavMenu";
import { BuyerSideMenu } from "@/features/NavigationMenu/components/BuyerSideMenu";

export const AccountDeactivationRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <div className="flex">
        <BuyerSideMenu />
        <div className="flex-1 p-8">
          <BuyerAccountDeactivation />
        </div>
      </div>
    </>
  );
};
