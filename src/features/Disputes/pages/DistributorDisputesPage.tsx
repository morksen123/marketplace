import React from 'react';
import { DistributorDisputeList } from '../components/DistributorDisputeList';
import { useDispute } from '../hooks/useDispute';

export const DistributorDisputesPage: React.FC = () => {
    const { distributorDisputes, isDistributorDisputesLoading } = useDispute('distributor');

    if (isDistributorDisputesLoading) {
        return <div>Loading disputes...</div>;
    }

    return <DistributorDisputeList disputes={distributorDisputes || []} />;
};