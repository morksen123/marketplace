import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispute } from '../hooks/useDispute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, ArrowLeft, Calendar, User, DollarSign } from 'lucide-react';
import { DisputeStatus } from '../constants';
import { capitalizeFirstLetter } from '@/lib/utils';

export const BuyerDisputeDetailsPage: React.FC = () => {
  const { disputeId } = useParams<{ disputeId: string }>();
  const { getBuyerDispute } = useDispute('buyer');
  const { data: dispute, error } = getBuyerDispute(Number(disputeId));

  if (!dispute) {
    return <Skeleton className="w-full h-56" />;
  }

  if (error) {
    return <div className="text-center text-red-600">{error.message}</div>;
  }

  const getStatusBadge = (status: DisputeStatus) => {
    const statusColors: Record<DisputeStatus, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      RESOLVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={`${statusColors[status]} font-medium`}>
        {capitalizeFirstLetter(status)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/buyer/orders/disputes"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to My Disputes
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
                  Created On: {new Date(dispute.createdOn).toLocaleString()}
                </span>
              </div>
              {dispute.updatedOn && (
                <div className="flex items-center">
                  <Calendar className="mr-2 text-gray-600" size={16} />
                  <span className="text-sm text-gray-600">
                    Last Updated: {new Date(dispute.updatedOn).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <User className="mr-2 text-gray-600" size={16} />
                <span className="text-sm text-gray-600">
                  Order ID: {dispute.orderId}
                </span>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2 text-gray-600" size={16} />
                <span className="text-sm text-gray-600">
                  Disputed Amount: ${dispute.disputeAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-600 mb-2 flex items-center">
                <AlertTriangle className="mr-2" size={16} />
                Dispute Reason
              </h3>
              <p className="text-gray-600">{dispute.disputeDetails || 'No details provided'}</p>
            </div>

            {dispute.disputeResultDetails && (
              <>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-600 mb-2">Admin Response</h3>
                  <p className="text-gray-600">{dispute.disputeResultDetails}</p>
                </div>
              </>
            )}

            <Separator className="my-4" />

            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Disputed Amount</span>
              <span>${dispute.disputeAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};