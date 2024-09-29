import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CreditCard, Package, SearchIcon } from 'lucide-react';
import React, { useState } from 'react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Payment {
  id: string;
  transactionId: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  orderItems: OrderItem[];
}

const payments: Payment[] = [
  {
    id: '1',
    transactionId: 'TRX123456',
    date: '2023-05-15',
    amount: 150.75,
    status: 'completed',
    orderItems: [
      { id: 'item1', name: 'Product A', quantity: 2, price: 50.25 },
      { id: 'item2', name: 'Product B', quantity: 1, price: 50.25 },
    ],
  },
  {
    id: '2',
    transactionId: 'TRX789012',
    date: '2023-05-14',
    amount: 75.5,
    status: 'completed',
    orderItems: [{ id: 'item3', name: 'Product C', quantity: 1, price: 75.5 }],
  },
  {
    id: '3',
    transactionId: 'TRX345678',
    date: '2023-05-13',
    amount: 200.0,
    status: 'pending',
    orderItems: [{ id: 'item4', name: 'Product D', quantity: 2, price: 100.0 }],
  },
];

export const PaymentHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = payments.filter(
    (payment) =>
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.date.includes(searchTerm),
  );

  return (
    <Card className="wrapper mt-12">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <CreditCard className="mr-2" />
          Payment History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by transaction ID or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <SearchIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.transactionId}
                  </TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.status === 'completed'
                          ? 'secondary'
                          : payment.status === 'pending'
                          ? 'warning'
                          : 'destructive'
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Package className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Order Details</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Items:</h4>
                          {payment.orderItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center mb-2"
                            >
                              <span>
                                {item.name} (x{item.quantity})
                              </span>
                              <span>
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                          <Separator className="my-4" />
                          <div className="flex justify-between items-center font-semibold">
                            <span>Total</span>
                            <span>${payment.amount.toFixed(2)}</span>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
