import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { OrderDetails } from '@/features/Payment/components/OrderDetails';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBuyerOrders } from '../hooks/useBuyerOrders';
import { Order } from '../types/orders';

export const BuyerOrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { cancelOrderMutation, completeOrderMutation, ordersQuery } = useBuyerOrders();
  const [isLoading, setIsLoading] = useState(false);

  const order = ordersQuery.data?.find(o => o.orderId === parseInt(orderId!, 10));

  const handleCancelOrder = async () => {
    setIsLoading(true);
    try {
      await cancelOrderMutation.mutateAsync(parseInt(orderId!, 10));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteOrder = async () => {
    setIsLoading(true);
    try {
      await completeOrderMutation.mutateAsync(parseInt(orderId!, 10));
    } finally {
      setIsLoading(false);
    }
  };

  const renderActionButtons = (order: Order) => {
    switch (order.status) {
      case 'PENDING':
        return (
          <Button
            variant="secondary"
            onClick={handleCancelOrder}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cancel Order'}
          </Button>
        );
      case 'DELIVERED':
      case 'PICKUP':
        return (
          <Button
            variant="secondary"
            onClick={handleCompleteOrder}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Complete Order'}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/buyer/orders"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to All Orders
        </Link>
        {order && renderActionButtons(order)}
      </div>

      <OrderDetails orderIds={[parseInt(orderId!, 10)]} />
    </div>
  );
};
