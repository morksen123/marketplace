import { Chats } from "@/features/Chats/components/Chats";
import { BuyerNavMenu } from "@/features/NavigationMenu/components/BuyerNavMenu";
import { BuyerSideMenu } from "@/features/NavigationMenu/components/BuyerSideMenu";

export const ChatsRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <div className="flex">
        <BuyerSideMenu />
        <div className="flex-1 p-8">
          <Chats />
        </div>
      </div>
    </>
  );
};
