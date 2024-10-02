import { DistributorNavMenu } from "@/features/NavigationMenu/components/DistributorNavMenu";
import EditPromotion from "@/features/Promotions/components/EditPromotion";

export const EditDistributorPromotionsRoute = () => {
    return (
      <div>
        <DistributorNavMenu />
        <EditPromotion />
      </div>
    );
  };