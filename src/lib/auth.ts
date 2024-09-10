import { LoginResponse, User } from '@/types/api';
import { post } from './api-client';

interface LoginCredentials {
  email: string;
  password: string;
}

export async function login(
  credentials: LoginCredentials,
): Promise<User | null> {
  const { data, error } = await post<LoginResponse>('/auth/login', credentials);
  if (data) {
    return data.user;
  }

  if (error) {
    console.error('Login error:', error);
  }

  return null;
}

export async function logout(): Promise<void> {
  await post<void>('/auth/logout', {});
}

export async function refreshAuth(): Promise<boolean> {
  const { data, error } = await post<LoginResponse>('/auth/refresh', {});

  if (error) {
    console.error('Refresh token error:', error);
  }

  // If successful, the server will have set a new cookie
  return !!data;
}
