import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';
import ShippingAddresses from '../../../features/BuyerAccount/components/ShippingAddresses';

export const ShippingAddressesPage = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <ShippingAddresses />;
    </>
  );
}
