import { toast } from '@/hooks/use-toast';
import { ApiError, ApiResponse } from '@/types/api';

export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const handleApiError = (error: ApiError): void => {
  console.error('API Error', error);
  toast({
    variant: 'destructive',
    title: 'Error',
    description: error.message || 'An unexpected error occured',
  });
};

export async function apiClient<T>(
  endpoint: string,
  method: string = 'GET',
  body: unknown = null,
): Promise<ApiResponse<T>> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // This is crucial for sending and receiving cookies
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);

    if (response.status === 401) {
      // Token is invalid or expired, user needs to login again
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const error: ApiError = new Error(
        response.statusText || 'An error occurred',
      );
      error.status = response.status;
      throw error;
    }

    const data: T = await response.json();
    return { data, error: null };
  } catch (error) {
    const apiError = error as ApiError;
    handleApiError(apiError);
    return { data: null, error: apiError };
  }
}

export const get = <T>(endpoint: string): Promise<ApiResponse<T>> =>
  apiClient<T>(endpoint);
export const post = <T>(
  endpoint: string,
  body: unknown,
): Promise<ApiResponse<T>> => apiClient<T>(endpoint, 'POST', body);
export const put = <T>(
  endpoint: string,
  body: unknown,
): Promise<ApiResponse<T>> => apiClient<T>(endpoint, 'PUT', body);
export const del = <T>(endpoint: string): Promise<ApiResponse<T>> =>
  apiClient<T>(endpoint, 'DELETE');
