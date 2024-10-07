import { Faq } from '@/features/Faq/components/Faq';
import { DistributorNavMenu } from '@/features/NavigationMenu/components/DistributorNavMenu';

export const DistributorFaqRoute = () => {
    return (
        <div>
          <DistributorNavMenu />
          <Faq />
        </div>
      );
};
