import BuyerAccountDeactivation from '@/features/BuyerAccount/components/BuyerAccountDeactivation';
import { BuyerNavMenu } from "@/features/NavigationMenu/components/BuyerNavMenu";

export const AccountDeactivationRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <BuyerAccountDeactivation />
    </>
  );
};
