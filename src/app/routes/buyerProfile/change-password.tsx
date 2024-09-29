import BuyerChangePassword from '@/features/BuyerAccount/components/BuyerChangePassword';
import { BuyerNavMenu } from "@/features/NavigationMenu/components/BuyerNavMenu";
import { BuyerSideMenu } from "@/features/NavigationMenu/components/BuyerSideMenu";

export const ChangePasswordRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <div className="flex">
        <BuyerSideMenu />
        <div className="flex-1 p-8">
          <BuyerChangePassword />
        </div>
      </div>
    </>
  );
};
