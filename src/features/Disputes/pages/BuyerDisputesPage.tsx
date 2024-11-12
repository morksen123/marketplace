import React from 'react';
import { BuyerDisputeList } from '../components/BuyerDisputeList';
import { useDispute } from '../hooks/useDispute';

export const BuyerDisputesPage: React.FC = () => {
    const { buyerDisputes, isBuyerDisputesLoading } = useDispute('buyer');

    if (isBuyerDisputesLoading) {
        return <div>Loading disputes...</div>;
    }

    return <BuyerDisputeList disputes={buyerDisputes || []} />;
};