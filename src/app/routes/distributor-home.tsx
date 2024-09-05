import { DistributorHome } from '@/features/Home/components/DistributorHome';
import { DistributorNavMenu } from '@/features/NavigationMenu/components/DistributorNavMenu';

export const DistributorHomeRoute = () => {
  return (
    <div>
      <DistributorNavMenu />
      <DistributorHome />
    </div>
  );
};