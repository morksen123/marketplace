import { DistributorNavMenu } from "@/features/NavigationMenu/components/DistributorNavMenu";
import { OrdersSideMenu } from "@/features/NavigationMenu/components/OrdersSideMenu";
import { DistributorDisputesPage } from "@/features/Disputes/pages/DistributorDisputesPage";

export const DistributorDisputesRoute = () => {
  return (
    <div>
      <DistributorNavMenu />
      <div className="flex">
        <OrdersSideMenu userType="distributor" />
        <div className="flex-1 p-8">
          <DistributorDisputesPage />
        </div>
      </div>
    </div>
  );
};