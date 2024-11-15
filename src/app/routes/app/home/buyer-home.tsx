import { BuyerHome } from '@/features/Home/components/BuyerHome';
import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';

export const BuyerHomeRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={true} />
      <div className="w-full">
      <BuyerHome />
      </div>
    </>
  );
};
