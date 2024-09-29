import { DistributorNavMenu } from "@/features/NavigationMenu/components/DistributorNavMenu";
import ViewBoostedProducts from "@/features/Promotions/components/ViewBoostedProducts";

export const ViewBoostedProductsRoute = () => {
    return (
      <div>
        <DistributorNavMenu />
        <ViewBoostedProducts/>
      </div>
    );
  };