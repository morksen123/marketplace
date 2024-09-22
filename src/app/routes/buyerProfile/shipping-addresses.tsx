import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';
import { BuyerSideMenu } from "@/features/NavigationMenu/components/BuyerSideMenu";
import ShippingAddresses from '../../../features/BuyerAccount/components/ShippingAddresses';

export const ShippingAddressesPage = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <div className="flex">
        <BuyerSideMenu />
        <div className="flex-1 p-8">
          <ShippingAddresses />
        </div>
      </div>
    </>
  );
}
