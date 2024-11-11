import { DistributorNavMenu } from "@/features/NavigationMenu/components/DistributorNavMenu";
import { DistributorRefundDetailsPage } from "@/features/Refunds/pages/DistributorRefundDetailsPage";
import { OrdersSideMenu } from "@/features/NavigationMenu/components/OrdersSideMenu";

export const DistributorRefundDetailsRoute = () => {
  return (
    <div>
      <DistributorNavMenu />
      <div className="flex">
        <OrdersSideMenu userType="distributor" />
        <div className="flex-1 p-8">
          <DistributorRefundDetailsPage />
        </div>
      </div>
    </div>
  );
};