import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDistributorRefunds, getDistributorRefundById, acceptDistributorRefund, rejectDistributorRefund } from '../api/distributor-refunds';
import { Refund } from '../types/refunds';

export const useDistributorRefunds = (refundId?: number) => {
    const queryClient = useQueryClient();

    const refundsQuery = useQuery<Refund[] | null>({
        queryKey: ['distributorRefunds'],
        queryFn: () => getDistributorRefunds(),
    });

    const refundByIdQuery = useQuery<Refund | null>({
        queryKey: ['distributorRefundById', refundId],
        queryFn: () => getDistributorRefundById(refundId!),
        enabled: !!refundId,
    });

    const acceptRefundMutation = useMutation<void, Error, { orderId: number, refundId: number }>({
        mutationFn: ({ orderId, refundId }) => acceptDistributorRefund(orderId, refundId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['distributorRefunds'] });
            refundsQuery.refetch();
        },
    });

    const rejectRefundMutation = useMutation<void, Error, { orderId: number, refundId: number }>({
        mutationFn: ({ orderId, refundId }) => rejectDistributorRefund(orderId, refundId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['distributorRefunds'] });
            refundsQuery.refetch();
        },
    });

    return {
        refunds: refundsQuery.data,
        refund: refundByIdQuery.data,
        acceptRefund: acceptRefundMutation,
        rejectRefund: rejectRefundMutation,
        isLoadingRefunds: refundsQuery.isLoading,
        isLoadingRefundById: refundByIdQuery.isLoading,
    };
}
