import { DistributorNavMenu } from "@/features/NavigationMenu/components/DistributorNavMenu";
import CreatePromotionPage from "@/features/Promotions/components/CreatePromotion";

export const CreateDistributorPromotionsRoute = () => {
    return (
      <div>
        <DistributorNavMenu />
        <CreatePromotionPage />
      </div>
    );
  };