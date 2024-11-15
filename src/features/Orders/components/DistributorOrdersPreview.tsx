import React, { useState, useMemo } from 'react';
import { useDistributorOrders } from '../hooks/useDistributorOrders';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, ArrowDown, ArrowUp } from 'lucide-react';
import { OrderStatus } from '../types/orders';
import { Button } from '@/components/ui/button';

export const DistributorOrdersPreview: React.FC = () => {
  const { orders, isLoadingOrders } = useDistributorOrders();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const recentOrders = useMemo(() => {
    return orders
      ?.slice()
      .sort((a, b) => {
        const dateA = new Date(a.createdDateTime).getTime();
        const dateB = new Date(b.createdDateTime).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      })
      .slice(0, 5) || [];
  }, [orders, sortOrder]);

  if (isLoadingOrders) {
    return <div>Loading recent orders...</div>;
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
    };

    const displayStatus = status === 'PICKUP' ? 'AWAITING PICKUP' : status;

    return <Badge className={`${statusColors[status]} font-medium`}>{displayStatus}</Badge>;
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center justify-between">
          <div className="flex items-center">
            <Package className="mr-2" size={20} />
            Recent Orders
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="flex items-center"
          >
            {sortOrder === 'asc' ? (
              <>
                Oldest Orders <ArrowUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Recent Orders <ArrowDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {recentOrders.length > 0 ? (
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div key={order.orderId} className="grid grid-cols-12 gap-2 items-center p-4 bg-white border border-gray-200 rounded-md shadow-sm">
                <div className="col-span-5 pl-0 text-left">
                  <h4 className="font-semibold text-sm">Order #{order.orderId}</h4>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Buyer:</span> {order.buyerEmail}
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Delivery:</span> {order.orderLineItems[0].deliveryMethod === 'DOORSTEP_DELIVERY' ? 'Doorstep Delivery' : 'Self Pick-up'}
                  </p>
                </div>
                <div className="col-span-3 text-right">
                  <p className="font-medium">
                    <span className="text-sm text-gray-500">Total:</span> ${order.orderTotal.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Date:</span> {new Date(order.createdDateTime).toLocaleDateString()}
                  </p>
                </div>
                <div className="col-span-4 flex justify-end">
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No recent orders</p>
        )}
        <div className="mt-6 flex justify-end">
          <Button asChild className="flex items-center button-green border border-gray-300 text-white hover:bg-green-600">
            <Link to="/distributor/orders">View All Orders</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
