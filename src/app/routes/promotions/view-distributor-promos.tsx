import { DistributorNavMenu } from "@/features/NavigationMenu/components/DistributorNavMenu";
import ViewDistributorPromotions from "@/features/Promotions/components/ViewDistributorPromotions";

export const ViewDistributorPromotionsRoute = () => {
    return (
      <div>
        <DistributorNavMenu />
        <ViewDistributorPromotions />
      </div>
    );
  };