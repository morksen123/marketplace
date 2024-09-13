/* eslint-disable react-refresh/only-export-components */
import { useAuthStatus } from '@/features/Authentication/hooks/useAuthStatus';
import {
  LoginCredentials,
  RegisterForm,
  RoleGuardProps,
  ROLES,
  RoleTypes,
} from '@/features/Authentication/types/auth';
import { LoginResponse, RegisterResponse } from '@/types/api';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { get, post } from './api-client';

export async function login(
  credentials: LoginCredentials,
  role: RoleTypes,
): Promise<LoginResponse | null> {
  const endpoint = role === ROLES.BUYER ? '/buyer/login' : '/distributor/login';
  const { data, error } = await post<LoginResponse>(endpoint, credentials);

  if (error) {
    throw new Error(`Login error: ${error.message}`);
  }

  return data || null;
}

export async function register(
  userData: RegisterForm,
): Promise<RegisterResponse | null> {
  const { data } = await post<RegisterResponse>('/buyer/register', userData);

  return data || null;
}

export async function logout(): Promise<void> {
  await post<void>('/auth/logout', {});
}

export const checkAuth = async () => {
  const { data } = await get('/auth/check');
  return data;
};

export const AuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuthStatus();

  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // change to a nicer spinner
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/auth/login?redirectTo=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return <Outlet />;
};

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles }) => {
  const cookies = new Cookies();
  const userRole = cookies.get('user_role');

  if (!userRole || !allowedRoles.includes(userRole as RoleTypes)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
