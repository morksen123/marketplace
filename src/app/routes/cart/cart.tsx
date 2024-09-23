import { Cart } from '@/features/Cart/components/Cart';
import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';

export const CartRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <Cart />
    </>
  );
};
