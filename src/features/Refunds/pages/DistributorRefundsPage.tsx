import React from 'react';
import { DistributorRefundsList } from '../components/DistributorRefundsList';
import { useDistributorRefunds } from '../hooks/useDistributorRefunds';

export const DistributorRefundsPage: React.FC = () => {
    const { refunds, isLoadingRefunds } = useDistributorRefunds();

    if (isLoadingRefunds) {
        return <div>Loading refunds...</div>;
    }

    return <DistributorRefundsList refunds={refunds || []} />;
};
