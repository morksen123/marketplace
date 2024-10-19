import { Faq } from '@/features/Faq/components/Faq';
import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';

export const BuyerFaqRoute = () => {
    return (
        <div>
          <BuyerNavMenu showTabs={false} />
          <Faq />
        </div>
      );
};
