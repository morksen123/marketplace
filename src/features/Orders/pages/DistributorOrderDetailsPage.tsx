import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDistributorOrders } from '../hooks/useDistributorOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, ArrowLeft } from 'lucide-react';
import { capitalizeFirstLetter } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export const DistributorOrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { 
    order, 
    isLoadingOrders, 
    acceptOrder, 
    rejectOrder, 
    shipOrder, 
    deliverOrder,
    awaitPickupOrder,
    refetchOrders
  } = useDistributorOrders(Number(orderId));

  const [isUpdating, setIsUpdating] = useState(false);

  if (isLoadingOrders) {
    return <Skeleton className="w-full h-56" />;
  }

  if (!order) {
    return <div className="text-center">Order not found</div>;
  }

  const handleStatusUpdate = async (action: () => Promise<void>) => {
    setIsUpdating(true);
    try {
      await action();
      await refetchOrders();
    } finally {
      setIsUpdating(false);
    }
  };

  const renderActionButtons = () => {
    switch (order.status) {
      case 'PENDING':
        return (
          <>
            <Button
              onClick={() => handleStatusUpdate(() => acceptOrder.mutateAsync(order.orderId))}
              variant="secondary"
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 size={24} /> : 'Accept Order'}
            </Button>
            <Button
              onClick={() => handleStatusUpdate(() => rejectOrder.mutateAsync(order.orderId))}
              variant="destructive"
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 size={24} /> : 'Reject Order'}
            </Button>
          </>
        );
      case 'ACCEPTED':
        return order.orderLineItems[0]?.deliveryMethod === 'SELF_PICK_UP' ? (
          <Button
            onClick={() => handleStatusUpdate(() => awaitPickupOrder.mutateAsync(order.orderId))}
            variant="secondary"
            disabled={isUpdating}
          >
            {isUpdating ? <Loader2 size={24} /> : 'Set Awaiting Pickup'}
          </Button>
        ) : (
          <Button
            onClick={() => {
              const trackingNo = prompt('Enter tracking number:');
              if (trackingNo) {
                handleStatusUpdate(() => shipOrder.mutateAsync({ orderId: order.orderId, trackingNo }));
              }
            }}
            variant="secondary"
            disabled={isUpdating}
          >
            {isUpdating ? <Loader2 size={24} /> : 'Ship Order'}
          </Button>
        );
      case 'SHIPPED':
      case 'PICKUP':
        return (
          <Button
            onClick={() => handleStatusUpdate(() => deliverOrder.mutateAsync(order.orderId))}
            variant="secondary"
            disabled={isUpdating}
          >
            {isUpdating ? <Loader2 size={24} /> : 'Mark as Delivered'}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/distributor/orders"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="mr-2" size={20} />
        Back to All Orders
      </Link>

      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
            <Package className="mr-2" size={20} />
            Order Details - #{order.orderId}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-600">Order Status</h3>
                <Badge
                  variant={
                    order.status === 'COMPLETED'
                      ? 'secondary'
                      : order.status === 'PENDING'
                      ? 'warning'
                      : 'default'
                  }
                >
                  {capitalizeFirstLetter(order.status)}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600">Order Date</h3>
                <p>{new Date(order.createdDateTime).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600">Buyer ID</h3>
                <p>{order.buyerId}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600">Buyer Email</h3>
                <p>{order.buyerEmail}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600">Transaction ID</h3>
                <p>{order.transactionId}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600">Order Fees</h3>
                <p>${order.orderFees.toFixed(2)}</p>
              </div>
              {order.trackingNo && (
                <div>
                  <h3 className="font-semibold text-gray-600">Tracking Number</h3>
                  <p>{order.trackingNo}</p>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <h3 className="font-semibold text-gray-600 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.orderLineItems.map((item) => (
                <div key={item.orderLineItemId} className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-500">Product ID: {item.productId}</p>
                    </div>
                    <div className="text-right">
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm">Delivery Method: {item.deliveryMethod}</p>
                  {item.pickUpLocation && (
                    <p className="text-sm">Pick-up Location: {item.pickUpLocation}</p>
                  )}
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-600 mb-2">Shipping Address</h3>
                <p>{order.shippingAddress?.label ?? 'N/A'}</p>
                <p>{order.shippingAddress?.addressLine1 ?? 'N/A'}</p>
                <p>{order.shippingAddress?.addressLine2 ?? ''}</p>
                <p>{order.shippingAddress?.postalCode ?? 'N/A'}</p>
                <p>Phone: {order.shippingAddress?.phoneNumber ?? 'N/A'}</p>
              </div>
              {order.pickUpLocation && (
                <div>
                  <h3 className="font-semibold text-gray-600 mb-2">Pick-up Location</h3>
                  <p>{order.pickUpLocation}</p>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Total Order Amount</span>
              <span>${order.orderTotal.toFixed(2)}</span>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              {renderActionButtons()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
