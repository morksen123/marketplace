import { LoadingSpinnerSvg } from '@/components/common/LoadingSpinner';
import React from 'react';
import { BuyerOrderList } from '../components/BuyerOrderList';
import { useBuyerOrders } from '../hooks/useBuyerOrders';

export const BuyerOrdersPage: React.FC = () => {
  const { ordersQuery } = useBuyerOrders();

  if (ordersQuery.isLoading) {
    return (
      <div>
        <LoadingSpinnerSvg />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <BuyerOrderList orders={ordersQuery.data || []} />
    </div>
  );
};
