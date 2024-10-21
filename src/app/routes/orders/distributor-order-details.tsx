import { DistributorNavMenu } from "@/features/NavigationMenu/components/DistributorNavMenu";
import { DistributorOrderDetailsPage } from "@/features/Orders/pages/DistributorOrderDetailsPage";

export const DistributorOrderDetailsRoute = () => {
  return (
    <div>
      <DistributorNavMenu />
      <DistributorOrderDetailsPage />
    </div>
  );
};