import DistributorChangePassword from '@/features/DIstributorAccount/components/DistributorChangePassword';
import { DistributorNavMenu } from '@/features/NavigationMenu/components/DistributorNavMenu';

export const ChangePasswordRoute = () => {
  return (
    <>
      <DistributorNavMenu />
      <DistributorChangePassword />
    </>
  );
};
