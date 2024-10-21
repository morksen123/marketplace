// Buyer DTO Type
interface BuyerDTO {
  id: string;
  name: string;
  role: string;
}

// Distributor DTO Type
interface DistributorDTO {
  id: string;
  name: string;
  role: string;
}

// Union type for user info
export type UserInfo = BuyerDTO | DistributorDTO;

// Authentication Response Type
export type LoginResponse = UserInfo;
export interface RegisterResponse {
  email: string;
  role: string;
}

export interface ApiError extends Error {
  status?: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}