import { PendingReviewsPage } from '@/features/Feedback/PendingReviewsPage';
import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';

export const ReviewsPendingRoute = () => {
  return (
    <>
      <BuyerNavMenu showTabs={false} />
      <PendingReviewsPage />
    </>
  );
};
