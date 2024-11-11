import { get, put } from '@/lib/api-client';
import { handleErrorApi } from '@/lib/api-client';
import { Order, OrderStatus } from '../types/orders';

export async function getDistributorOrders(): Promise<Order[] | null> {
    try {
        const { data } = await get<Order[]>('/distributor/orders');
        return data;
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, 'Failed to fetch distributor orders');
        } else {
            handleErrorApi('An unknown error occurred', 'Failed to fetch distributor orders');
        }
        return null;
    }
}

export async function getDistributorOrderById(orderId: number): Promise<Order | null> {
    try {
        const { data } = await get<Order>(`/distributor/orders/${orderId}`);
        return data;
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, `Failed to fetch order with ID ${orderId}`);
        } else {
            handleErrorApi('An unknown error occurred', `Failed to fetch order with ID ${orderId}`);
        }
        return null;
    }
}

export async function getDistributorOrderByStatus(status: OrderStatus): Promise<Order[] | null> {
    try {
        const { data } = await get<Order[]>(`/distributor/orders/status?status=${status}`);
        return data;
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, `Failed to fetch orders with status ${status}`);
        } else {
            handleErrorApi('An unknown error occurred', `Failed to fetch orders with status ${status}`);
        }
        return null;
    }
}

export async function acceptDistributorOrder(orderId: number): Promise<void> {
    try {
        await put(`/distributor/order/${orderId}/accept`, {});
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, `Failed to accept order with ID ${orderId}`);
        } else {
            handleErrorApi('An unknown error occurred', `Failed to accept order with ID ${orderId}`);
        }
    }
}

export async function rejectDistributorOrder(orderId: number): Promise<void> {
    try {
        await put(`/distributor/order/${orderId}/reject`, {});
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, `Failed to reject order with ID ${orderId}`);
        } else {
            handleErrorApi('An unknown error occurred', `Failed to reject order with ID ${orderId}`);
        }
    }
}

export async function setAwaitingPickupDistributorOrder(orderId: number): Promise<void> {
    try {
        await put(`/distributor/order/${orderId}/awaiting-pickup`, {});
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, `Failed to set status to awaiting pickup for order with ID ${orderId}`);
        } else {
            handleErrorApi('An unknown error occurred', `Failed to set status to awaiting pickup for order with ID ${orderId}`);
        }
    }
}

export async function shipDistributorOrder(orderId: number, trackingNo: string): Promise<void> {
    try {
        await put(`/distributor/order/${orderId}/shipped?trackingNo=${trackingNo}`, {});
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, `Failed to ship order with ID ${orderId}`);
        } else {
            handleErrorApi('An unknown error occurred', `Failed to ship order with ID ${orderId}`);
        }
    }
}

export async function deliverDistributorOrder(orderId: number): Promise<void> {
    try {
        await put(`/distributor/order/${orderId}/delivered`, {});
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, `Failed to set status to delivered for order with ID ${orderId}`);
        } else {
            handleErrorApi('An unknown error occurred', `Failed to set status to delivered for order with ID ${orderId}`);
        }
    }
}

export async function completeDistributorOrder(orderId: number): Promise<void> {
    try {
        await put(`/distributor/order/${orderId}/completed`, {});
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, `Failed to complete order with ID ${orderId}`);
        } else {
            handleErrorApi('An unknown error occurred', `Failed to complete order with ID ${orderId}`);
        }
    }
}

