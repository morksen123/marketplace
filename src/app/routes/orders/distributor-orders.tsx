import { DistributorNavMenu } from "@/features/NavigationMenu/components/DistributorNavMenu";
import { DistributorOrdersPage } from "@/features/Orders/pages/DistributorOrdersPage";
import { OrdersSideMenu } from "@/features/NavigationMenu/components/OrdersSideMenu";

export const DistributorOrdersRoute = () => {
  return (
    <div>
      <DistributorNavMenu />
      <div className="flex">
        <OrdersSideMenu userType="distributor" />
        <div className="flex-1 p-8">
          <DistributorOrdersPage />
        </div>
      </div>
    </div>
  );
};