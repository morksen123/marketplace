import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  DollarSign,
  RefreshCw,
  User,
} from 'lucide-react';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

interface TransactionDetail {
  key: string;
  value: string;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'Payment' | 'Refund';
  status: 'Completed' | 'Pending' | 'Failed';
  customerName: string;
  customerEmail: string;
  details: TransactionDetail[];
}

// In a real application, you would fetch this data based on the transaction ID
const mockTransaction: Transaction = {
  id: 'TRX-12345-67890',
  date: '2023-05-15T14:30:00Z',
  amount: 150.75,
  type: 'Payment',
  status: 'Completed',
  customerName: 'John Doe',
  customerEmail: 'john.doe@example.com',
  details: [
    { key: 'Payment Method', value: 'Credit Card' },
    { key: 'Card Type', value: 'Visa' },
    { key: 'Last 4 Digits', value: '4242' },
    { key: 'Payment Processor', value: 'Stripe' },
    { key: 'Payment Intent ID', value: 'pi_1234567890' },
    { key: 'Application Fee', value: '$4.50' },
  ],
};

export const TransactionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const transaction = mockTransaction; // In a real app, you'd fetch the transaction based on the ID

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/transactions"
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="mr-2" size={20} />
        Back to Transactions
      </Link>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Transaction Details
          </CardTitle>
          <CardDescription>Transaction ID: {transaction.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Calendar className="mr-2" size={20} />
                Date
              </h3>
              <p>{formatDate(transaction.date)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <DollarSign className="mr-2" size={20} />
                Amount
              </h3>
              <p>${transaction.amount.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <CreditCard className="mr-2" size={20} />
                Transaction Type
              </h3>
              <Badge
                variant={
                  transaction.type === 'Payment' ? 'secondary' : 'destructive'
                }
              >
                {transaction.type}
              </Badge>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <RefreshCw className="mr-2" size={20} />
                Status
              </h3>
              <Badge
                variant={
                  transaction.status === 'Completed'
                    ? 'secondary'
                    : transaction.status === 'Pending'
                    ? 'warning'
                    : 'destructive'
                }
              >
                {transaction.status}
              </Badge>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <User className="mr-2" size={20} />
                Customer Information
              </h3>
              <p>{transaction.customerName}</p>
              <p className="text-sm text-gray-500">
                {transaction.customerEmail}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Transaction Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Detail</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transaction.details.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{detail.key}</TableCell>
                  <TableCell>{detail.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
