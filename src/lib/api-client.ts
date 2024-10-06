import { toast } from '@/hooks/use-toast';
import { ApiError, ApiResponse } from '@/types/api';

export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const handleSuccessApi = (title: string, description: string) => {
  toast({
    variant: 'success',
    title: title,
    description: description,
  });
};

export const handleErrorApi = (title: string, description: string) => {
  toast({
    variant: 'destructive',
    title: title,
    description: description,
  });
};

const handleApiError = (error: ApiError): void => {
  toast({
    variant: 'destructive',
    title: 'Error',
    description: error.message || 'An unexpected error occured',
  });
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: ApiError = new Error(errorData.message || 'An error occurred');
    error.status = response.status;
    throw error;
  }
  // original:
  // return response.json();

  // can handle text response
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("text/plain")) {
    const text = await response.text();
    return text as unknown as T;
  }
  return response.json();
}

// TODO: allow plain text server response
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
      // Handle unauthorized error
      const error = new Error('Unauthorized: Please log in again') as ApiError;
      error.status = 401;
      throw error;
    }

    const data = await handleResponse<T>(response);
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
