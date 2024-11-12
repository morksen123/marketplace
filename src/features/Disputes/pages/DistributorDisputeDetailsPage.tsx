import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispute } from '../hooks/useDispute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  User,
  Package,
  MessageSquare,
} from 'lucide-react';
import { DisputeStatus, Dispute } from '../constants';
import { capitalizeFirstLetter } from '@/lib/utils';

export const DistributorDisputeDetailsPage: React.FC = () => {
  const { disputeId } = useParams<{ disputeId: string }>();
  const { getDistributorDispute } = useDispute('distributor');
  const {data: disputeData, error} = getDistributorDispute(Number(disputeId));
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (disputeData) {
      setDispute(disputeData);
      setIsLoading(false);
    }
  }, [disputeData]);

  if (isLoading) {
    return <Skeleton className="w-full h-56" />;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (!dispute) {
    return <div className="text-center">Dispute not found</div>;
  }

  const getStatusBadge = (status: DisputeStatus) => {
    const statusColors: Record<DisputeStatus, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      REJECTED: 'bg-red-100 text-red-800',
      RESOLVED: 'bg-green-100 text-green-800',
    };

    return (
      <Badge className={`${statusColors[status]} font-medium`}>{capitalizeFirstLetter(status)}</Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/distributor/orders/disputes"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to All Disputes
        </Link>
      </div>

      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
            <AlertTriangle className="mr-2" size={20} />
            Dispute Details - #{dispute.disputeId}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold flex items-center">
                <AlertTriangle className="mr-2 text-gray-600" size={20} />
                Dispute #{dispute.disputeId}
              </h4>
              {getStatusBadge(dispute.disputeStatus)}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Calendar className="mr-2 text-gray-600" size={16} />
                <span className="text-sm text-gray-600">
                  Filed Date: {new Date(dispute.createdOn).toLocaleString()}
                </span>
              </div>
              {dispute.updatedOn && (
                <div className="flex items-center">
                  <Calendar className="mr-2 text-gray-600" size={16} />
                  <span className="text-sm text-gray-600">
                    Resolved Date:{' '}
                    {new Date(dispute.updatedOn).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <Package className="mr-2 text-gray-600" size={16} />
                <Link 
                  to={`/distributor/orders/${dispute.orderId}`}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Order ID: {dispute.orderId}
                </Link>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-600 mb-2 flex items-center">
                <MessageSquare className="mr-2" size={16} />
                Dispute Reason
              </h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-md">
                {dispute.disputeDetails}
              </p>
            </div>

            {/* {dispute.evidence && (
              <>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-600 mb-2 flex items-center">
                    <AlertTriangle className="mr-2" size={16} />
                    Supporting Evidence
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-600">{dispute.evidence}</p>
                  </div>
                </div>
              </>
            )} */}

            {dispute.disputeResultDetails && (
              <>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-600 mb-2 flex items-center">
                    <MessageSquare className="mr-2" size={16} />
                    Result Details by Admin
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-600">
                      {dispute.disputeResultDetails}
                    </p>
                  </div>
                </div>
              </>
            )}

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Associated Order Amount</span>
              <span className="font-semibold">
                ${dispute.disputeAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
