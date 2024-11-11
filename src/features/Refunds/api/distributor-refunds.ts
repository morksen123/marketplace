import { get, put } from '@/lib/api-client';
import { handleErrorApi } from '@/lib/api-client';
import { Refund } from '../types/refunds';

export async function getDistributorRefunds(): Promise<Refund[] | null> {
    try {
        const { data } = await get<Refund[]>('/distributor/orders/refunds');
        return data;
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, 'Failed to fetch distributor refunds');
        } else {
            handleErrorApi('An unknown error occurred', 'Failed to fetch distributor refunds');
        }
        return null;
    }
}

export async function getDistributorRefundById(refundId: number): Promise<Refund | null> {
    try {
        const { data } = await get<Refund>(`/distributor/orders/refunds/${refundId}`);
        return data;
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, `Failed to fetch refund with ID ${refundId}`);
        } else {
            handleErrorApi('An unknown error occurred', `Failed to fetch refund with ID ${refundId}`);
        }
        return null;
    }
}

export async function acceptDistributorRefund(orderId: number, refundId: number): Promise<void> {
    try {
        await put(`/distributor/order/${orderId}/refund/${refundId}/accept`, {});
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, `Failed to accept refund with ID ${refundId}`);
        } else {
            handleErrorApi('An unknown error occurred', `Failed to accept refund with ID ${refundId}`);
        }
    }
}

export async function rejectDistributorRefund(orderId: number, refundId: number): Promise<void> {
    try {
        await put(`/distributor/order/${orderId}/refund/${refundId}/reject`, {});
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, `Failed to reject refund with ID ${refundId}`);
        } else {
            handleErrorApi('An unknown error occurred', `Failed to reject refund with ID ${refundId}`);
        }
    }
}

