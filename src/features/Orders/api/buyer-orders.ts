import { get, put } from '@/lib/api-client';
import { handleErrorApi } from '@/lib/api-client';
import { Order, OrderStatus } from '../types/orders';

export async function getBuyerOrders(): Promise<Order[] | null> {
    try {
        const { data } = await get<Order[]>('/buyer/orders');
        return data;
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, 'Failed to fetch buyer orders');
        } else {
            handleErrorApi('An unknown error occurred', 'Failed to fetch buyer orders');
        }
        return null;
    }
}

export async function getBuyerOrderById(orderId: number): Promise<Order | null> {
    try {
        const { data } = await get<Order>(`/buyer/orders/${orderId}`);
        return data;
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, `Failed to fetch buyer order with ID ${orderId}`);
        } else {
            handleErrorApi('An unknown error occurred', `Failed to fetch buyer order with ID ${orderId}`);
        }
        return null;
    }
}

export async function getBuyerOrderByStatus(status: OrderStatus): Promise<Order[] | null> {
    try {
        const { data } = await get<Order[]>(`/buyer/orders/status?status=${status}`);
        return data;
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, `Failed to fetch buyer orders with status ${status}`);
        } else {
            handleErrorApi('An unknown error occurred', `Failed to fetch buyer orders with status ${status}`);
        }
        return null;
    }
}

export async function cancelBuyerOrder(orderId: number): Promise<void> {
    try {
        await put(`/buyer/order/${orderId}/cancel`, {});
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, `Failed to cancel buyer order with ID ${orderId}`);
        } else {
            handleErrorApi('An unknown error occurred', `Failed to cancel buyer order with ID ${orderId}`);
        }
    }
}

export async function completeBuyerOrder(orderId: number): Promise<void> {
    try {
        await put(`/buyer/order/${orderId}/complete`, {});
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, `Failed to complete buyer order with ID ${orderId}`);
        } else {
            handleErrorApi('An unknown error occurred', `Failed to complete buyer order with ID ${orderId}`);
        }
    }
}