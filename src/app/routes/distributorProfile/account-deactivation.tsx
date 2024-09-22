import DistributorAccountDeactivation from '@/features/DIstributorAccount/components/DistributorAccountDeactivation';
import { DistributorNavMenu } from '@/features/NavigationMenu/components/DistributorNavMenu';
import { DistributorSideMenu } from '@/features/NavigationMenu/components/DistributorSideMenu';

export const AccountDeactivationRoute = () => {
  return (
    <>
      <DistributorNavMenu />
      <div className="flex">
        <DistributorSideMenu />
        <div className="flex-1 p-8">
          <DistributorAccountDeactivation />
        </div>
      </div>
    </>
  );
};
