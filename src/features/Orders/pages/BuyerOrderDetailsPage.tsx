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

  // Use the orderId to find the specific order
  const order = ordersQuery.data?.find(o => o.orderId === parseInt(orderId!, 10));

  const handleAction = async (action: 'cancel' | 'complete') => {
    setIsLoading(true);
    try {
      if (action === 'cancel') {
        await cancelOrderMutation.mutateAsync(parseInt(orderId!, 10));
      } else {
        await completeOrderMutation.mutateAsync(parseInt(orderId!, 10));
      }
      // Refetch the orders after the action
      await ordersQuery.refetch();
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
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
            onClick={() => handleAction('cancel')}
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
            onClick={() => handleAction('complete')}
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
