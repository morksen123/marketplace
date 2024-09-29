import DistributorProfileManagement from '@/features/DIstributorAccount/components/DistributorProfileManagement';
import { DistributorNavMenu } from '@/features/NavigationMenu/components/DistributorNavMenu';
import { DistributorSideMenu } from '@/features/NavigationMenu/components/DistributorSideMenu';

export const ProfileManagementRoute = () => {
  return (
    <>
      <DistributorNavMenu />
      <div className="flex">
        <DistributorSideMenu />
        <div className="flex-1 p-8">
          <DistributorProfileManagement />
        </div>
      </div>
    </>
  );
};
