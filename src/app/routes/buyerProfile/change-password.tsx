import BuyerChangePassword from '@/features/BuyerAccount/components/BuyerChangePassword';
import { BuyerNavMenu } from "@/features/NavigationMenu/components/BuyerNavMenu";

export const ChangePasswordRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <BuyerChangePassword />
    </>
  );
};
