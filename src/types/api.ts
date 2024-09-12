export type BaseEntity = {
  id: string;
  createdAt: number;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export type User = Entity<{
  firstName: string;
  lastName: string;
  email: string;
  homeAddress: string;
  role: UserRole;
}>;

export type LoginResponse = {
  user: User;
};

export interface ApiError extends Error {
  status?: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export type UserRole = 'Buyer' | 'Distributor';
