import React from 'react';
import { DistributorOrderList } from '../components/DistributorOrderList';
import { useDistributorOrders } from '../hooks/useDistributorOrders';

export const DistributorOrdersPage: React.FC = () => {
    const { orders, isLoadingOrders } = useDistributorOrders();

    if (isLoadingOrders) {
        return <div>Loading orders...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <DistributorOrderList orders={orders || []} />
        </div>
    );
};
