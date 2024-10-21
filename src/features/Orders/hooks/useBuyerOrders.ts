import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBuyerOrders, getBuyerOrderById, getBuyerOrderByStatus, cancelBuyerOrder, completeBuyerOrder } from '../api/buyer-orders';
import { Order, OrderStatus } from '../types/orders';

export const useBuyerOrders = (orderId?: number, orderStatus?: OrderStatus) => {
    const queryClient = useQueryClient();

    const ordersQuery = useQuery<Order[] | null>({
        queryKey: ['buyerOrders'],
        queryFn: () => getBuyerOrders(),
    });

    const orderByIdQuery = useQuery<Order | null>({
        queryKey: ['buyerOrderById', orderId],
        queryFn: () => getBuyerOrderById(orderId!),
        enabled: !!orderId,
    });

    const orderByStatusQuery = useQuery<Order[] | null>({
        queryKey: ['buyerOrderByStatus', orderStatus],
        queryFn: () => getBuyerOrderByStatus(orderStatus!),
        enabled: !!orderStatus,
    });

    const cancelOrderMutation = useMutation<void, Error, number>({
        mutationFn: cancelBuyerOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['buyerOrders'] });
            ordersQuery.refetch();
        },
    });

    const completeOrderMutation = useMutation<void, Error, number>({
        mutationFn: completeBuyerOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['buyerOrders'] });
            ordersQuery.refetch();
        },
    });

    return { ordersQuery, orderByIdQuery, orderByStatusQuery, cancelOrderMutation, completeOrderMutation };
};