import { get, post } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { Dispute, DisputeRequest } from '../constants'

// Buyer endpoints
export const getBuyerDisputes = async (): Promise<ApiResponse<Dispute[]>> => {
  return get<Dispute[]>('/buyer/orders/disputes');
};

export const getBuyerPendingDisputes = async (): Promise<ApiResponse<Dispute[]>> => {
  return get<Dispute[]>('/buyer/orders/disputes/pending');
};

export const getBuyerDisputeById = async (
  disputeId: number,
): Promise<ApiResponse<Dispute>> => {
  return get<Dispute>(`/buyer/orders/disputes/${disputeId}`);
};

export const lodgeDispute = async (
  orderId: number,
  refundId: number,
  disputeRequest: DisputeRequest,
): Promise<ApiResponse<string>> => {
  return post<string>(
    `/buyer/order/${orderId}/refunds/${refundId}/dispute`,
    disputeRequest,
  );
};

// Distributor endpoints
export const getDistributorDisputes = async (): Promise<ApiResponse<Dispute[]>> => {
  return get<Dispute[]>('/distributor/orders/disputes');
};

export const getDistributorPendingDisputes = async (): Promise<ApiResponse<Dispute[]>> => {
  return get<Dispute[]>('/distributor/orders/disputes/pending');
};

export const getDistributorDisputeById = async (
  disputeId: number,
): Promise<ApiResponse<Dispute>> => {
  return get<Dispute>(`/distributor/orders/disputes/${disputeId}`);
};