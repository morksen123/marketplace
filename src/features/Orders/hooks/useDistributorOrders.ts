import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDistributorOrders, getDistributorOrderById, getDistributorOrderByStatus, acceptDistributorOrder, rejectDistributorOrder, setAwaitingPickupDistributorOrder, shipDistributorOrder, deliverDistributorOrder } from '../api/distributor-orders';
import { Order, OrderStatus } from '../types/orders';

export const useDistributorOrders = (orderId?: number, orderStatus?: OrderStatus) => {
    const queryClient = useQueryClient();

    const ordersQuery = useQuery<Order[] | null>({
        queryKey: ['distributorOrders'],
        queryFn: () => getDistributorOrders(),
    });

    const orderByIdQuery = useQuery<Order | null>({
        queryKey: ['distributorOrderById', orderId],
        queryFn: () => getDistributorOrderById(orderId!),
        enabled: !!orderId,
    });

    const orderByStatusQuery = useQuery<Order[] | null>({
        queryKey: ['distributorOrderByStatus', orderStatus],
        queryFn: () => getDistributorOrderByStatus(orderStatus!),
        enabled: !!orderStatus,
    });

    const acceptOrderMutation = useMutation<void, Error, number>({
        mutationFn: acceptDistributorOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['distributorOrders'] });
            ordersQuery.refetch();
        },
    });

    const rejectOrderMutation = useMutation<void, Error, number>({
        mutationFn: rejectDistributorOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['distributorOrders'] });
            ordersQuery.refetch();
        },
    });

    const awaitPickupOrderMutation = useMutation<void, Error, number>({
        mutationFn: setAwaitingPickupDistributorOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['distributorOrders'] });
            ordersQuery.refetch();
        },
    });

    const shipOrderMutation = useMutation<void, Error, { orderId: number, trackingNo: string }>({
        mutationFn: ({ orderId, trackingNo }) => shipDistributorOrder(orderId, trackingNo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['distributorOrders'] });
            ordersQuery.refetch();
        },
    });

    const deliverOrderMutation = useMutation<void, Error, number>({
        mutationFn: deliverDistributorOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['distributorOrders'] });
            ordersQuery.refetch();
        },
    });

    return { 
        orders: ordersQuery.data, 
        isLoadingOrders: ordersQuery.isLoading,
        refetchOrders: ordersQuery.refetch,
        order: orderByIdQuery.data, 
        ordersByStatus: orderByStatusQuery.data, 
        acceptOrder: acceptOrderMutation, 
        rejectOrder: rejectOrderMutation, 
        awaitPickupOrder: awaitPickupOrderMutation,
        shipOrder: shipOrderMutation, 
        deliverOrder: deliverOrderMutation 
    };  
}
