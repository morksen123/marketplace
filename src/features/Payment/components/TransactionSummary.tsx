import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RoleTypes } from '@/features/Authentication/types/auth';
import { Transaction } from '@/features/Payment/types/payment';
import { capitalizeFirstLetter, formatDisplayDate } from '@/lib/utils';
import {
  ArrowDownRight,
  Calendar,
  CreditCard,
  DollarSign,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';

export const TransactionSummary: React.FC<{
  transaction: Transaction;
  userRole: RoleTypes;
}> = ({ userRole, transaction }) => {
  const grossAmount = (transaction.amount / 100).toFixed(2);
  const netAmount = (
    (transaction.amount - (transaction.applicationFee ?? 0)) /
    100
  ).toFixed(2);

  return (
    <Card className="shadow-sm border border-gray-200">
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
              Transaction Date
            </h3>
            <p className="text-lg text-gray-900">
              {formatDisplayDate(transaction.createdDateTime)}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 flex items-center">
              <DollarSign className="mr-2" size={16} />
              Gross Amount
            </h3>
            <p className="text-lg text-gray-900">${grossAmount}</p>
          </div>
          {userRole === 'DISTRIBUTOR' && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 flex items-center">
                <ArrowDownRight className="mr-2" size={16} />
                Net Amount
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="ml-1" size={14} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Amount earned after deducting the application fee</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h3>
              <p className="text-lg text-gray-900">${netAmount}</p>
            </div>
          )}
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
              {capitalizeFirstLetter(transaction.status)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
