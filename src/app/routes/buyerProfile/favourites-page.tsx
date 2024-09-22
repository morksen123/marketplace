import FavouritesPage from '@/features/BuyerAccount/components/FavouritesPage';
import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';
import { BuyerSideMenu } from "@/features/NavigationMenu/components/BuyerSideMenu";

export const FavouritesPageRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <div className="flex">
        <BuyerSideMenu />
        <div className="flex-1 p-8">
          <FavouritesPage />
        </div>
      </div>
    </>
  );
}
