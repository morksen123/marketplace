import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { handleSuccessApi, handleErrorApi } from '@/lib/api-client';
import {
  getBuyerDisputes,
  getBuyerPendingDisputes,
  getBuyerDisputeById,
  lodgeDispute,
  getDistributorDisputes,
  getDistributorPendingDisputes,
  getDistributorDisputeById,
} from '../lib/dispute';
import { DisputeRequest } from '../constants';

export function useDispute(role: 'buyer' | 'distributor' = 'buyer') {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Buyer Queries
  const buyerDisputesQuery = useQuery({
    queryKey: ['buyerDisputes'],
    queryFn: async () => {
      const { data, error } = await getBuyerDisputes();
      if (error) throw error;
      return data;
    },
    enabled: role === 'buyer', // Only run for buyers
  });

  const buyerPendingDisputesQuery = useQuery({
    queryKey: ['buyerPendingDisputes'],
    queryFn: async () => {
      const { data, error } = await getBuyerPendingDisputes();
      if (error) throw error;
      return data;
    },
    enabled: role === 'buyer',
  });

  const getBuyerDisputeQuery = (disputeId: number) =>
    useQuery({
      queryKey: ['buyerDispute', disputeId],
      queryFn: async () => {
        const { data, error } = await getBuyerDisputeById(disputeId);
        if (error) throw error;
        return data;
      },
    });

  // Distributor Queries
  const distributorDisputesQuery = useQuery({
    queryKey: ['distributorDisputes'],
    queryFn: async () => {
      const { data, error } = await getDistributorDisputes();
      if (error) throw error;
      return data;
    },
    enabled: role === 'distributor', // Only run for distributors
  });

  const distributorPendingDisputesQuery = useQuery({
    queryKey: ['distributorPendingDisputes'],
    queryFn: async () => {
      const { data, error } = await getDistributorPendingDisputes();
      if (error) throw error;
      return data;
    },
    enabled: role === 'distributor',
  });

  const getDistributorDisputeQuery = (disputeId: number) =>
    useQuery({
      queryKey: ['distributorDispute', disputeId],
      queryFn: async () => {
        const { data, error } = await getDistributorDisputeById(disputeId);
        if (error) throw error;
        return data;
      },
    });

  // Mutations
  const lodgeDisputeMutation = useMutation({
    mutationFn: async ({
      orderId,
      refundId,
      disputeRequest,
    }: {
      orderId: number;
      refundId: number;
      disputeRequest: DisputeRequest;
    }) => {
      const { error } = await lodgeDispute(orderId, refundId, disputeRequest);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyerDisputes'] });
      queryClient.invalidateQueries({ queryKey: ['buyerPendingDisputes'] });
      handleSuccessApi('Dispute Lodged', 'Your dispute has been lodged successfully.');
      navigate('/buyer/orders');
    },
    onError: (error: Error) => {
      handleErrorApi('Error', error.message);
    },
  });

  return {
    // Buyer data and functions
    buyerDisputes: buyerDisputesQuery.data,
    buyerPendingDisputes: buyerPendingDisputesQuery.data,
    isBuyerDisputesLoading: buyerDisputesQuery.isLoading,
    getBuyerDispute: getBuyerDisputeQuery,
    lodgeDispute: lodgeDisputeMutation.mutate,

    // Distributor data and functions
    distributorDisputes: distributorDisputesQuery.data,
    distributorPendingDisputes: distributorPendingDisputesQuery.data,
    isDistributorDisputesLoading: distributorDisputesQuery.isLoading,
    getDistributorDispute: getDistributorDisputeQuery,
  };
}