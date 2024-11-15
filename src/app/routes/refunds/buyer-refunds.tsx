import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';
import { BuyerSideMenu } from '@/features/NavigationMenu/components/BuyerSideMenu';
import { BuyerRefundsPage } from '@/features/Refunds/pages/BuyerRefundsPage';

export const BuyerRefundsRoute = () => {
    return (
        <>
            <BuyerNavMenu showTabs={false} />
            <div className="flex">
                <BuyerSideMenu />
                <div className="flex-1 p-8">
                    <BuyerRefundsPage />
                </div>
            </div>
        </>
    );
};