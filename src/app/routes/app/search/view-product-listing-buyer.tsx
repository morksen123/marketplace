import { ViewProductListingBuyer } from '@/features/ProductCatalogue/components/ViewProductListingBuyer';
import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';

export const ViewProductListingBuyerRoute = () => {
  return (
    <div>
      <BuyerNavMenu showTabs={false} />
      <ViewProductListingBuyer isBuyer={true} />
    </div>
  );
};
