import DistributorAccountDeactivation from '@/features/DistributorAccount/components/DistributorAccountDeactivation';
import { DistributorNavMenu } from '@/features/NavigationMenu/components/DistributorNavMenu';

export const AccountDeactivationRoute = () => {
  return (
    <>
      <DistributorNavMenu />
      <DistributorAccountDeactivation />
    </>
  );
};
