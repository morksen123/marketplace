import React from 'react';
import { BuyerRefundsList } from '../components/BuyerRefundsList';
import { useBuyerRefunds } from '../hooks/useBuyerRefunds';

export const BuyerRefundsPage: React.FC = () => {
    const { refunds, isLoadingRefunds } = useBuyerRefunds();

    if (isLoadingRefunds) {
        return <div>Loading refunds...</div>;
    }

    return <BuyerRefundsList refunds={refunds || []} />;
};
