import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';
import { BuyerSideMenu } from '@/features/NavigationMenu/components/BuyerSideMenu';
import { BuyerRefundDetailsPage } from '@/features/Refunds/pages/BuyerRefundDetailsPage';

export const BuyerRefundDetailsRoute = () => {
    return (
        <>
            <BuyerNavMenu showTabs={false} />
            <div className="flex">
                <BuyerSideMenu />
                <div className="flex-1 p-8">
                    <BuyerRefundDetailsPage />
                </div>
            </div>
        </>
    );
};