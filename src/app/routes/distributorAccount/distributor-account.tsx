import DistributorProfileManagement from '@/features/DIstributorAccount/components/DistributorProfileManagement';
import { DistributorNavMenu } from '@/features/NavigationMenu/components/DistributorNavMenu';

export const ProfileManagementRoute = () => {
  return (
    <>
      <DistributorNavMenu />
      <DistributorProfileManagement />;
    </>
  );
};
