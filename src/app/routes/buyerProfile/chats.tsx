import { BuyerNavMenu } from "@/features/NavigationMenu/components/BuyerNavMenu";
import { BuyerSideMenu } from "@/features/NavigationMenu/components/BuyerSideMenu";
import { BuyerChats } from '@/features/Chats/components/BuyerChats';

export const ChatsRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <div className="flex">
        <BuyerSideMenu />
        <div className="flex-1 p-8">
          <BuyerChats />
        </div>
      </div>
    </>
  );
};
