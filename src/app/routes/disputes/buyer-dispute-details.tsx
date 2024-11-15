import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';
import { BuyerSideMenu } from '@/features/NavigationMenu/components/BuyerSideMenu';
import { BuyerDisputeDetailsPage } from '@/features/Disputes/pages/BuyerDisputeDetailsPage';

export const BuyerDisputeDetailsRoute = () => {
    return (
        <>
            <BuyerNavMenu showTabs={false} />
            <div className="flex">
                <BuyerSideMenu />
                <div className="flex-1 p-8">
                    <BuyerDisputeDetailsPage />
                </div>
            </div>
        </>
    );
};