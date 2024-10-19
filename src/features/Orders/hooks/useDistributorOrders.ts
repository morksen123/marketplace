import { useQuery, useMutation } from '@tanstack/react-query';
import { getDistributorOrders, getDistributorOrderById, getDistributorOrderByStatus, acceptDistributorOrder, rejectDistributorOrder, shipDistributorOrder, deliverDistributorOrder } from '../api/distributor-orders';
import { Order, OrderStatus } from '../types/orders';

export const useDistributorOrders = (orderId?: number, orderStatus?: OrderStatus) => {
    
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
    });

    const rejectOrderMutation = useMutation<void, Error, number>({
        mutationFn: rejectDistributorOrder,
    });

    const shipOrderMutation = useMutation<void, Error, { orderId: number, trackingNo: string }>({
        mutationFn: ({ orderId, trackingNo }) => shipDistributorOrder(orderId, trackingNo),
    });

    const deliverOrderMutation = useMutation<void, Error, number>({
        mutationFn: deliverDistributorOrder,
    });

    return { 
        orders: ordersQuery.data, 
        isLoadingOrders: ordersQuery.isLoading,
        order: orderByIdQuery.data, 
        ordersByStatus: orderByStatusQuery.data, 
        acceptOrder: acceptOrderMutation, 
        rejectOrder: rejectOrderMutation, 
        shipOrder: shipOrderMutation, 
        deliverOrder: deliverOrderMutation 
    };  
}
