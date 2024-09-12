import { SignUpSchema } from '@/features/Authentication/schema';
import { LoginResponse, User, UserRole } from '@/types/api';
import { z } from 'zod';
import { post } from './api-client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export type RegisterForm = z.infer<typeof SignUpSchema>;

export interface RegisterResponse {
  message: string;
  user: User;
}

export async function login(
  credentials: LoginCredentials,
  role: UserRole,
): Promise<User | null> {
  const endpoint = role === 'Buyer' ? '/buyer/login' : '/distributor/login';
  const { data, error } = await post<LoginResponse>(endpoint, credentials);
  if (data) {
    return data.user;
  }

  if (error) {
    console.error('Login error:', error);
  }

  return null;
}

export async function register(userData: RegisterForm): Promise<User | null> {
  const { data, error } = await post<RegisterResponse>(
    '/buyer/register',
    userData,
  );

  if (data) {
    console.log('auth.ts', data);
    return data.user;
  }

  if (error) {
    console.error('Registration error:', error);
  }

  return null;
}

export async function logout(): Promise<void> {
  await post<void>('/auth/logout', {});
}
