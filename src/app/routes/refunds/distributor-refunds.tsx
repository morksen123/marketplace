import { DistributorNavMenu } from "@/features/NavigationMenu/components/DistributorNavMenu";
import { OrdersSideMenu } from "@/features/NavigationMenu/components/OrdersSideMenu";
import { DistributorRefundsPage } from "@/features/Refunds/pages/DistributorRefundsPage";

export const DistributorRefundsRoute = () => {
  return (
    <div>
      <DistributorNavMenu />
      <div className="flex">
        <OrdersSideMenu userType="distributor" />
        <div className="flex-1 p-8">
          <DistributorRefundsPage />
        </div>
      </div>
    </div>
  );
};