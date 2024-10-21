import { DistributorNavMenu } from "@/features/NavigationMenu/components/DistributorNavMenu";
import { DistributorOrdersPage } from "@/features/Orders/pages/DistributorOrdersPage";

export const DistributorOrdersRoute = () => {
  return (
    <div>
      <DistributorNavMenu />
      <DistributorOrdersPage />
    </div>
  );
};