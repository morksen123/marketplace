import { DistributorChats } from '@/features/Chats/components/DistributorChats';
import { DistributorNavMenu } from '@/features/NavigationMenu/components/DistributorNavMenu';
import { DistributorSideMenu } from '@/features/NavigationMenu/components/DistributorSideMenu';

export const ChatsRoute = () => {
  return (
    <>
      <DistributorNavMenu />
      <div className="flex">
        <DistributorSideMenu />
        <div className="flex-1 p-8">
          <DistributorChats />
        </div>
      </div>
    </>
  );
};
