import FavouritesPage from '@/features/BuyerAccount/components/FavouritesPage';
import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';

export const FavouritesPageRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <FavouritesPage />;
    </>
  );
}
