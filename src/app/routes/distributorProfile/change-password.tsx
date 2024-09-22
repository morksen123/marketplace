import DistributorChangePassword from '@/features/DIstributorAccount/components/DistributorChangePassword';
import { DistributorNavMenu } from '@/features/NavigationMenu/components/DistributorNavMenu';
import { DistributorSideMenu } from '@/features/NavigationMenu/components/DistributorSideMenu';

export const ChangePasswordRoute = () => {
  return (
    <>
      <DistributorNavMenu />
      <div className="flex">
        <DistributorSideMenu />
        <div className="flex-1 p-8">
          <DistributorChangePassword />
        </div>
      </div>
    </>
  );
};
