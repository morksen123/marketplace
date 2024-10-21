import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';
import { BuyerOrderDetailsPage } from '@/features/Orders/pages/BuyerOrderDetailsPage';
import { BuyerSideMenu } from '@/features/NavigationMenu/components/BuyerSideMenu';

export const BuyerOrderDetailsRoute = () => {
    return (
        <>
            <BuyerNavMenu showTabs={false} />
            <div className="flex">
                <BuyerSideMenu />
                <div className="flex-1 p-8">
                    <BuyerOrderDetailsPage />
                </div>
            </div>
        </>
    );
};
