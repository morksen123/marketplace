import { DistributorNavMenu } from "@/features/NavigationMenu/components/DistributorNavMenu";
import { OrdersSideMenu } from "@/features/NavigationMenu/components/OrdersSideMenu";
import { DistributorDisputeDetailsPage } from "@/features/Disputes/pages/DistributorDisputeDetailsPage";

export const DistributorDisputeDetailsRoute = () => {
  return (
    <div>
      <DistributorNavMenu />
      <div className="flex">
        <OrdersSideMenu userType="distributor" />
        <div className="flex-1 p-8">
          <DistributorDisputeDetailsPage />
        </div>
      </div>
    </div>
  );
};