export interface Dispute {
    disputeId: number;
    createdOn: Date;
    updatedOn: Date;
    disputeStatus: DisputeStatus;
    disputeAmount: number;
    disputeDetails: string;
    disputeResultDetails: string;
    buyerId: number;
    distributorId: number;
    administratorId?: number;
    orderId: number;
}

export interface DisputeDto {
    disputeId: number;
    createdOn: Date;
    updatedOn: Date;
    disputeStatus: DisputeStatus;
    disputeAmount: number;
    disputeDetails: string;
    disputeResultDetails: string;
    buyerId: number;
    distributorId: number;
    administratorId?: number;
    orderId: number;
}

export type DisputeStatus = 'PENDING' | 'RESOLVED' | 'REJECTED';

export interface DisputeRequest {
    disputeAmount: number; // amount in dollars
    disputeDetails: string;
}