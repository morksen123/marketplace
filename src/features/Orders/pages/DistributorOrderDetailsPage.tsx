import React from 'react';
import { useParams } from 'react-router-dom';
import { useDistributorOrders } from '../hooks/useDistributorOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const DistributorOrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { order, isLoadingOrders } = useDistributorOrders(Number(orderId));

  if (isLoadingOrders) {
    return <div className="flex justify-center items-center h-64">Loading order details...</div>;
  }

  if (!order) {
    return <div className="text-center">Order not found</div>;
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Order Details - #{order.orderId}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold">Order Status</h3>
            <Badge>{order.status}</Badge>
          </div>
          <div>
            <h3 className="font-semibold">Order Date</h3>
            <p>{new Date(order.createdDateTime).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="font-semibold">Buyer ID</h3>
            <p>{order.buyerId}</p>
          </div>
          <div>
            <h3 className="font-semibold">Total Amount</h3>
            <p>${order.orderTotal.toFixed(2)}</p>
          </div>
        </div>

        <h3 className="font-semibold mb-2">Order Items</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.orderLineItems.map((item) => (
              <TableRow key={item.orderLineItemId}>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

