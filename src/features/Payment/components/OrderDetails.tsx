import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { capitalizeFirstLetter } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Package } from 'lucide-react';
import React from 'react';
import { getOrderDetails } from '../api/payments';
import { DistributorInformation } from './DistributorInformation';
import { OrderStatus } from '../types/payment';

export const OrderDetails: React.FC<{ orderIds: number[] }> = ({
  orderIds,
}) => {
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['orders', orderIds],
    queryFn: () => getOrderDetails(orderIds),
  });
  if (isError) {
    return (
      <div className="text-red-500">
        Error loading order details: {error.message}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return <div>No order details available.</div>;
  }

  const getStatusBadge = (status: OrderStatus) => {
    const statusColors: Record<OrderStatus, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      ACCEPTED: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-red-100 text-red-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      PICKUP: 'bg-orange-100 text-orange-800',
      DELIVERED: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      REFUNDED: 'bg-pink-100 text-pink-800',
      IN_REFUND: 'bg-indigo-100 text-indigo-800',
      REFUND_REJECTED: 'bg-rose-100 text-rose-800',
      IN_DISPUTE: 'bg-amber-100 text-amber-800'
    };

    const displayStatus = status === 'PICKUP' ? 'AWAITING PICKUP' : capitalizeFirstLetter(status);

    return <Badge className={`${statusColors[status]} font-medium`}>{displayStatus}</Badge>;
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
          <Package className="mr-2" size={20} />
          Order Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {isLoading ? (
            <Skeleton className="w-full h-56" />
          ) : (
            orders.map((order) => (
              <div
                key={order.orderId}
                className="rounded-lg shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Package className="mr-2 text-gray-600" size={20} />
                    <h4 className="text-lg font-semibold">
                      Order #{order.orderId}
                    </h4>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                <DistributorInformation distributorId={order.distributorId} />

                <div className="mt-4">
                  <div className="grid grid-cols-12 gap-2 items-center mb-2 text-sm text-gray-600">
                    <span className="col-span-5">Product</span>
                    <span className="col-span-2">Price</span>
                    <span className="col-span-2 text-center">Quantity</span>
                    <span className="col-span-3 text-right">Total</span>
                  </div>
                  {order.orderLineItems.map((item, index) => (
                    <React.Fragment key={`${item.orderLineItemId}-${index}`}>
                      <div className="grid grid-cols-12 gap-2 items-center py-2 text-sm">
                        <span className="col-span-5 font-medium">
                          {item.productName}
                        </span>
                        <span className="col-span-2 text-gray-600">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="col-span-2 text-center text-gray-600">
                          {item.quantity}
                        </span>
                        <span className="col-span-3 text-right font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      {index < order.orderLineItems.length - 1 && (
                        <div className="col-span-12">
                          <Separator className="my-2" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span>${order.orderTotal.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
