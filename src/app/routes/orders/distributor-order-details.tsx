import { DistributorNavMenu } from "@/features/NavigationMenu/components/DistributorNavMenu";
import { OrdersSideMenu } from "@/features/NavigationMenu/components/OrdersSideMenu";
import { DistributorOrderDetailsPage } from "@/features/Orders/pages/DistributorOrderDetailsPage";

export const DistributorOrderDetailsRoute = () => {
  return (
    <div>
      <DistributorNavMenu />
      <div className="flex">
        <OrdersSideMenu userType="distributor" />
        <div className="flex-1 p-8">
          <DistributorOrderDetailsPage />
        </div>
      </div>
    </div>
  );
};