import ProfileManagement from "@/features/BuyerAccount/components/ProfileManagement";
import { BuyerNavMenu } from "@/features/NavigationMenu/components/BuyerNavMenu";

export const ProfileManagementRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <ProfileManagement />
    </>
  )
};
