import { FeedbackAnalytics } from '@/features/Feedback/components/FeedbackAnalytics';
import { DistributorNavMenu } from '@/features/NavigationMenu/components/DistributorNavMenu';

export const DistributorAnalyticsPage = () => {
  return (
    <>
      <DistributorNavMenu />
      <FeedbackAnalytics />
    </>
  );
};
