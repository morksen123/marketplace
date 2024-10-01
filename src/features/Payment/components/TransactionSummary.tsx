import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Transaction } from '@/features/Payment/types/payment';
import { formatDisplayDate } from '@/lib/utils';
import { Calendar, CreditCard, DollarSign, RefreshCw } from 'lucide-react';
import React from 'react';

export const TransactionSummary: React.FC<{ transaction: Transaction }> = ({
  transaction,
}) => (
  <Card className="mb-8 shadow-sm border border-gray-200">
    <CardHeader className="bg-gray-50 border-b border-gray-200">
      <CardTitle className="text-2xl font-semibold text-gray-800">
        Transaction Summary
      </CardTitle>
      <CardDescription className="text-gray-600">
        Transaction ID: {transaction.id}
      </CardDescription>
    </CardHeader>
    <CardContent className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500 flex items-center">
            <Calendar className="mr-2" size={16} />
            Date
          </h3>
          <p className="text-lg text-gray-900">
            {formatDisplayDate(transaction.createdDateTime)}
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500 flex items-center">
            <DollarSign className="mr-2" size={16} />
            Amount
          </h3>
          <p className="text-lg text-gray-900">
            ${(transaction.amount / 100).toFixed(2)}
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500 flex items-center">
            <CreditCard className="mr-2" size={16} />
            Transaction Type
          </h3>
          <Badge variant="secondary" className="text-sm">
            Payment
          </Badge>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500 flex items-center">
            <RefreshCw className="mr-2" size={16} />
            Status
          </h3>
          <Badge
            variant={
              transaction.status === 'COMPLETED'
                ? 'secondary'
                : transaction.status === 'PENDING'
                ? 'warning'
                : 'destructive'
            }
            className="text-sm"
          >
            {transaction.status}
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
);
