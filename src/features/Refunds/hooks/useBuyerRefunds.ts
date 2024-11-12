import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBuyerRefunds, getBuyerRefundById, cancelBuyerRefund } from '../api/buyer-refunds';
import { Refund } from '../types/refunds';

export const useBuyerRefunds = (refundId?: number) => {
    const queryClient = useQueryClient();

    const refundsQuery = useQuery<Refund[] | null>({
        queryKey: ['buyerRefunds'],
        queryFn: () => getBuyerRefunds(),
    });

    const refundByIdQuery = useQuery<Refund | null>({
        queryKey: ['buyerRefundById', refundId],
        queryFn: () => getBuyerRefundById(refundId!),
        enabled: !!refundId,
    });

    const cancelRefundMutation = useMutation<void, Error, number>({
        mutationFn: cancelBuyerRefund,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['buyerRefunds'] });
            refundsQuery.refetch();
        },
    });

    return {
        refunds: refundsQuery.data,
        refund: refundByIdQuery.data,
        cancelRefund: cancelRefundMutation,
        isLoadingRefunds: refundsQuery.isLoading,
        isLoadingRefundById: refundByIdQuery.isLoading,
    };
};
