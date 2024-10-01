import { BuyerNavMenu } from "@/features/NavigationMenu/components/BuyerNavMenu";
import BuyerSalePromotionPage from "@/features/Home/components/BuyerSalePromotion";

export const BuyerSaleRoute = () => {
    return (
      <div>
        <BuyerNavMenu showTabs={true} />
        <BuyerSalePromotionPage />
      </div>
    );
  };