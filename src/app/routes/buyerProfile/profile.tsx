import { BuyerNavMenu } from "@/features/NavigationMenu/components/BuyerNavMenu";
import { BuyerSideMenu } from "@/features/NavigationMenu/components/BuyerSideMenu";
import { Profile } from "@/features/Sustainability/Profile/Profile";
    
export const ProfileRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <div className="flex">
        <BuyerSideMenu />
        <div className="flex-1 p-8">
          <Profile profile={{}} />
        </div>
      </div>
    </>
  )
};
