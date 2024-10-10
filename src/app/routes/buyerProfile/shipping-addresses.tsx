import AddressBook from '@/features/BuyerAccount/components/AddressBook';
import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';
import { BuyerSideMenu } from '@/features/NavigationMenu/components/BuyerSideMenu';

export const ShippingAddressesPage = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <div className="flex">
        <BuyerSideMenu />
        <div className="flex-1 p-8">
          <AddressBook />
        </div>
      </div>
    </>
  );
};
