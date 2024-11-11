import { get, put } from '@/lib/api-client';
import { handleErrorApi } from '@/lib/api-client';
import { Refund } from '../types/refunds';

export async function getBuyerRefunds(): Promise<Refund[] | null> {
    try {
        const { data } = await get<Refund[]>('/buyer/orders/refunds');
        return data;
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, 'Failed to fetch buyer refunds');
        } else {
            handleErrorApi('An unknown error occurred', 'Failed to fetch buyer refunds');
        }
        return null;
    }
}

export async function getBuyerRefundById(refundId: number): Promise<Refund | null> {
    try {
        const { data } = await get<Refund>(`/buyer/orders/refunds/${refundId}`);
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

export async function cancelBuyerRefund(refundId: number): Promise<void> {
    try {
        await put(`/buyer/orders/refunds/cancel/${refundId}`, {});
    } catch (error) {
        if (error instanceof Error) {
            handleErrorApi(error.message, `Failed to cancel refund with ID ${refundId}`);
        } else {
            handleErrorApi('An unknown error occurred', `Failed to cancel refund with ID ${refundId}`);
        }
    }
}
