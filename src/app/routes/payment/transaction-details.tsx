import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderDetails } from '@/features/Payment/components/OrderDetails';
import { TransactionDetails } from '@/features/Payment/components/TransactionDetails';
import { TransactionSummary } from '@/features/Payment/components/TransactionSummary';
import { usePayments } from '@/features/Payment/hooks/usePayments';
import { getUserRoleFromCookie } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

export const TransactionDetailsPage: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const userRole = getUserRoleFromCookie();

  const { transactionQuery } = usePayments(Number(transactionId));

  const { data: transaction, isLoading: transactionLoading } = transactionQuery;

  return (
    <div className="container mx-auto px-4 py-8 text-left">
      <div className="max-w-4xl mx-auto">
        <Link
          to={`/${userRole.toLowerCase()}/transactions`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="mr-2" size={20} />
          <span>Back to Transactions</span>
        </Link>

        {transactionLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : !transaction ? (
          <Card className="text-center p-8 shadow-sm border border-gray-200">
            <CardTitle className="text-2xl font-semibold text-gray-800 mb-4">
              No Transaction Found
            </CardTitle>
            <CardDescription className="text-gray-600">
              The requested transaction could not be found. Please check the
              transaction ID and try again.
            </CardDescription>
            <Button asChild className="mt-6" variant={'secondary'}>
              <Link to={`/${userRole.toLowerCase()}/transactions`}>
                Return to Transactions
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-8">
            <TransactionSummary transaction={transaction} />
            <TransactionDetails transaction={transaction} />
            <OrderDetails orderIds={transaction.orderIds} />
          </div>
        )}
      </div>
    </div>
  );
};
