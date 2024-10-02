import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { post } from '@/lib/api-client';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const RetryOnboarding = () => {
  const { connectedAccountId } = useParams<{ connectedAccountId: string }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface RetryOnboardingData {
    onboardingUrl: string;
  }

  useEffect(() => {
    const retryOnboarding = async () => {
      try {
        const { data } = await post<RetryOnboardingData>(
          `/distributor/retry-onboarding?connectedAccountId=${connectedAccountId}`,
          {},
        );

        if (data?.onboardingUrl) {
          window.location.href = data.onboardingUrl;
        } else {
          throw new Error('Failed to retrieve onboarding link');
        }
      } catch (err) {
        setError('Failed to retry onboarding. Please try again later.');
        window.location.href = '/';
        setLoading(false);
      }
    };

    retryOnboarding();
  }, [connectedAccountId]);

  if (loading) {
    return (
      <div className="wrapper">
        <LoadingSpinner />
        Retrying your onboarding process...
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return null;
};
