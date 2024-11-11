import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBuyerRefunds } from '../hooks/useBuyerRefunds';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, ArrowLeft, Calendar, User, CreditCard, AlertCircle } from 'lucide-react';
import { RefundStatus } from '../types/refunds';
import { Button } from '@/components/ui/button';

export const BuyerRefundDetailsPage: React.FC = () => {
  const { refundId } = useParams<{ refundId: string }>();
  const { refund, isLoadingRefundById, cancelRefund } = useBuyerRefunds(Number(refundId));

  if (isLoadingRefundById) {
    return <Skeleton className="w-full h-56" />;
  }

  if (!refund) {
    return <div className="text-center">Refund request not found</div>;
  }

  const handleCancelRefund = async () => {
    try {
      await cancelRefund.mutateAsync(refund.refundId);
      window.location.reload();
    } catch (error) {
      console.error('Error canceling refund:', error);
    }
  };

  const getStatusBadge = (status: RefundStatus) => {
    const statusColors: Record<RefundStatus, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      ACCEPTED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };

    return <Badge className={`${statusColors[status]} font-medium`}>{status}</Badge>;
  };

  const renderActionButton = () => {
    if (refund.refundStatus === 'PENDING') {
      return (
        <Button
          variant="destructive"
          onClick={handleCancelRefund}
          disabled={cancelRefund.isPending}
        >
          {cancelRefund.isPending ? 'Canceling...' : 'Cancel Refund'}
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/buyer/orders/refunds"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to My Refunds
        </Link>
        {renderActionButton()}
      </div>

      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
            <Package className="mr-2" size={20} />
            Refund Request Details - #{refund.refundId}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold flex items-center">
                <Package className="mr-2 text-gray-600" size={20} />
                Refund #{refund.refundId}
              </h4>
              {getStatusBadge(refund.refundStatus)}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Calendar className="mr-2 text-gray-600" size={16} />
                <span className="text-sm text-gray-600">
                  Request Date: {new Date(refund.createdDateTime).toLocaleString()}
                </span>
              </div>
              {refund.completedDateTime && (
                <div className="flex items-center">
                  <Calendar className="mr-2 text-gray-600" size={16} />
                  <span className="text-sm text-gray-600">
                    Completed Date: {new Date(refund.completedDateTime).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <CreditCard className="mr-2 text-gray-600" size={16} />
                <span className="text-sm text-gray-600">
                  Transaction ID: {refund.transactionId}
                </span>
              </div>
              <div className="flex items-center">
                <User className="mr-2 text-gray-600" size={16} />
                <span className="text-sm text-gray-600">
                  Order ID: {refund.orderId}
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-600 mb-2 flex items-center">
                <AlertCircle className="mr-2" size={16} />
                Refund Reason
              </h3>
              <p className="text-gray-600">{refund.refundReason || 'No reason provided'}</p>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Refund Amount</span>
              <span>${refund.amount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
