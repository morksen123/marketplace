import { Checkout } from '@/features/Cart/components/Checkout';
import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';

export const CheckoutRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <Checkout />
    </>
  );
};
