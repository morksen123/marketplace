import { PendingReviewsPage } from '@/features/Feedback/components/PendingReviewsPage';
import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';

export const ReviewsPendingRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <PendingReviewsPage />
    </>
  );
};
