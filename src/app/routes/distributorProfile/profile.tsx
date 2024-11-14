import { DistributorNavMenu } from "@/features/NavigationMenu/components/DistributorNavMenu";
import { DistributorSideMenu } from "@/features/NavigationMenu/components/DistributorSideMenu";
import { DistributorProfile } from "@/features/Sustainability/Profile/DistributorProfile";
    
export const ProfileRoute = () => {
  return (
    <>
      <DistributorNavMenu />
      <div className="flex">
        <DistributorSideMenu />
        <div className="flex-1 p-8">
          <DistributorProfile />
        </div>
      </div>
    </>
  )
};
