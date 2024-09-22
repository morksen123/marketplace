import ProfileManagement from "@/features/BuyerAccount/components/ProfileManagement";
import { BuyerNavMenu } from "@/features/NavigationMenu/components/BuyerNavMenu";
import { BuyerSideMenu } from "@/features/NavigationMenu/components/BuyerSideMenu";

export const ProfileManagementRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <div className="flex">
        <BuyerSideMenu />
        <div className="flex-1 p-8">
          <ProfileManagement />
        </div>
      </div>
    </>
  )
};
