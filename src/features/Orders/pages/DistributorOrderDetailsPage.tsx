import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatus } from '@/features/Orders/types/orders';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDistributorOrders } from '../hooks/useDistributorOrders';

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
    refetchOrders,
  } = useDistributorOrders(Number(orderId));

  const [isUpdating, setIsUpdating] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  if (isLoadingOrders) {
    return <Skeleton className="w-full h-56" />;
  }

  if (!order) {
    return <div className="text-center">Order not found</div>;
  }

  const handleStatusUpdate = async (
    action: () => Promise<void>,
    actionName: string,
  ) => {
    setIsUpdating(true);
    setLastAction(actionName);
    try {
      await action();
      await refetchOrders();
      // Add a slight delay before reloading to ensure the refetch is complete
      setTimeout(() => {
        window.location.reload();
      }, 500);
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
              onClick={() =>
                handleStatusUpdate(
                  () => acceptOrder.mutateAsync(order.orderId),
                  'accept',
                )
              }
              variant="secondary"
              className="button-green"
              disabled={isUpdating}
            >
              {isUpdating && lastAction === 'accept' ? (
                <Loader2 size={24} className="h-4 w-4 animate-spin" />
              ) : (
                'Accept Order'
              )}
            </Button>
            <Button
              onClick={() =>
                handleStatusUpdate(
                  () => rejectOrder.mutateAsync(order.orderId),
                  'reject',
                )
              }
              variant="destructive"
              disabled={isUpdating}
            >
              {isUpdating && lastAction === 'reject' ? (
                <Loader2 size={24} className="h-4 w-4 animate-spin" />
              ) : (
                'Reject Order'
              )}
            </Button>
          </>
        );
      case 'ACCEPTED':
        return order.orderLineItems[0]?.deliveryMethod === 'SELF_PICK_UP' ? (
          <Button
            onClick={() =>
              handleStatusUpdate(
                () => awaitPickupOrder.mutateAsync(order.orderId),
                'awaitPickup',
              )
            }
            variant="secondary"
            disabled={isUpdating}
          >
            {isUpdating && lastAction === 'awaitPickup' ? (
              <Loader2 size={24} className="h-4 w-4 animate-spin" />
            ) : (
              'Set Awaiting Pickup'
            )}
          </Button>
        ) : (
          <Button
            onClick={() => {
              const trackingNo = prompt('Enter tracking number:');
              if (trackingNo) {
                handleStatusUpdate(
                  () =>
                    shipOrder.mutateAsync({
                      orderId: order.orderId,
                      trackingNo,
                    }),
                  'ship',
                );
              }
            }}
            variant="secondary"
            disabled={isUpdating}
          >
            {isUpdating && lastAction === 'ship' ? (
              <Loader2 size={24} className="h-4 w-4 animate-spin" />
            ) : (
              'Ship Order'
            )}
          </Button>
        );
      case 'SHIPPED':
      case 'PICKUP':
        return (
          <Button
            onClick={() =>
              handleStatusUpdate(
                () => deliverOrder.mutateAsync(order.orderId),
                'deliver',
              )
            }
            variant="secondary"
            disabled={isUpdating}
          >
            {isUpdating && lastAction === 'deliver' ? (
              <Loader2 size={24} className="h-4 w-4 animate-spin" />
            ) : (
              'Mark as Delivered'
            )}
          </Button>
        );
      default:
        return null;
    }
  };

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

    return (
      <Badge className={`${statusColors[status]} font-medium`}>
        {displayStatus}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/distributor/orders"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to All Orders
        </Link>
        <div className="flex space-x-2">{renderActionButtons()}</div>
      </div>

      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
            <Package className="mr-2" size={20} />
            Order Details - #{order.orderId}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold flex items-center">
                <Package className="mr-2 text-gray-600" size={20} />
                Order #{order.orderId}
              </h4>
              {getStatusBadge(order.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Calendar className="mr-2 text-gray-600" size={16} />
                <span className="text-sm text-gray-600">
                  Order Date: {new Date(order.createdDateTime).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center">
                <User className="mr-2 text-gray-600" size={16} />
                <span className="text-sm text-gray-600">
                  Buyer ID: {order.buyerId}
                </span>
              </div>
              <div className="flex items-center">
                <CreditCard className="mr-2 text-gray-600" size={16} />
                <span className="text-sm text-gray-600">
                  Transaction ID: {order.transactionId}
                </span>
              </div>
              <div className="flex items-center">
                <Truck className="mr-2 text-gray-600" size={16} />
                <span className="text-sm text-gray-600">
                  Order Fees: ${order.orderFees?.toFixed(2)}
                </span>
              </div>
              {order.trackingNo && (
                <div className="flex items-center">
                  <Truck className="mr-2 text-gray-600" size={16} />
                  <span className="text-sm text-gray-600">
                    Tracking Number: {order.trackingNo}
                  </span>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <h3 className="font-semibold text-gray-600 mb-4 flex items-center">
              <Package className="mr-2" size={16} />
              Order Items
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-2 items-center mb-2 text-sm text-gray-600 text-left">
                <span className="col-span-5">Product</span>
                <span className="col-span-2">Price</span>
                <span className="col-span-2 text-center">Quantity</span>
                <span className="col-span-3 text-right">Total</span>
              </div>
              {order.orderLineItems.map((item, index) => (
                <React.Fragment key={item.orderLineItem}>
                  <div className="grid grid-cols-12 gap-2 items-center py-2 text-sm text-left">
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
                    <Separator className="my-2" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-600 mb-2 flex items-center">
                  <MapPin className="mr-2" size={16} />
                  Shipping Address
                </h3>
                <p className="text-sm text-gray-600 text-left">
                  {order.shippingAddress?.label ?? 'N/A'}
                </p>
                <p className="text-sm text-gray-600 text-left">
                  {order.shippingAddress?.addressLine1 ?? 'N/A'}
                </p>
                <p className="text-sm text-gray-600 text-left">
                  {order.shippingAddress?.addressLine2 ?? ''}
                </p>
                <p className="text-sm text-gray-600 text-left">
                  {order.shippingAddress?.postalCode ?? 'N/A'}
                </p>
                <p className="text-sm text-gray-600 text-left flex items-center mt-1">
                  <Phone className="mr-2" size={14} />
                  {order.shippingAddress?.phoneNumber ?? 'N/A'}
                </p>
              </div>
              {order.pickUpLocation && (
                <div>
                  <h3 className="font-semibold text-gray-600 mb-2 flex items-center">
                    <MapPin className="mr-2" size={16} />
                    Pick-up Location
                  </h3>
                  <p className="text-sm text-gray-600">
                    {order.pickUpLocation}
                  </p>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Total Order Amount</span>
              <span>${order.orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
