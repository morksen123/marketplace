import { Skeleton } from '@/components/ui/skeleton';
import { useDistributorProfile } from '@/features/DIstributorAccount/hooks/useSpecificDistributorProfile';
import { Mail, User } from 'lucide-react';
import React from 'react';

interface DistributorInformationProps {
  distributorId: number;
}

export const DistributorInformation: React.FC<DistributorInformationProps> = ({
  distributorId,
}) => {
  const { distributorProfile, isLoading, error } =
    useDistributorProfile(distributorId);

  if (isLoading) {
    return (
      <>
        <Skeleton className="h-5 w-1/2 mb-2" />
        <Skeleton className="h-5 w-2/3 mb-2" />
      </>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-500 mb-2">
        Error loading distributor information.
      </p>
    );
  }

  if (!distributorProfile) {
    return (
      <p className="text-sm text-gray-500 mb-2">
        No distributor information available.
      </p>
    );
  }

  return (
    <>
      <p className="text-sm text-gray-600 mb-2 flex items-center">
        <User className="h-4 w-4 mr-2" />
        <span className="mr-1">Distributor:</span>
        <span className="font-medium">
          {distributorProfile.distributorName}
        </span>
      </p>
      <p className="text-sm text-gray-600 mb-2 flex items-center">
        <Mail className="h-4 w-4 mr-2" />
        <span className="mr-1">Distributor email:</span>
        <span className="font-medium">{distributorProfile.email}</span>
      </p>
    </>
  );
};
