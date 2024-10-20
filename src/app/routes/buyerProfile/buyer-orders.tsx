import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';
import { BuyerOrdersPage } from '@/features/Orders/pages/BuyerOrdersPage';
import { BuyerSideMenu } from '@/features/NavigationMenu/components/BuyerSideMenu';

export const BuyerOrdersRoute = () => {
    return (
        <>
            <BuyerNavMenu showTabs={false} />
            <div className="flex">
                <BuyerSideMenu />
                <div className="flex-1 p-8">
                    <BuyerOrdersPage />
                </div>
            </div>
        </>
    );
};
