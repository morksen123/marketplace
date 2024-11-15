import { Skeleton } from '@/components/ui/skeleton';

export const PaymentDetailsSkeleton = () => (
  <>
    <div className="space-y-2">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
    <div className="flex justify-center space-x-6 mt-6">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-32" />
    </div>
  </>
);
