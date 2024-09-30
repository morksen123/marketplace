/* eslint-disable react-refresh/only-export-components */
import { useAuthStatus } from '@/features/Authentication/hooks/useAuthStatus';
import {
  BuyerRegisterForm,
  DistributorRegisterForm,
  LoginCredentials,
  ResetPasswordFormValues,
  RoleGuardProps,
  ROLES,
  RoleTypes,
} from '@/features/Authentication/types/auth';
import { LoginResponse, RegisterResponse } from '@/types/api';
import { Navigate, Outlet } from 'react-router-dom';
import { get, post } from './api-client';
import { getUserRoleFromCookie } from './utils';

// actions
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

export async function buyerRegister(
  userData: BuyerRegisterForm,
): Promise<RegisterResponse | null> {
  const { data } = await post<RegisterResponse>('/buyer/register', userData);

  return data || null;
}

export async function distributorRegister(
  userData: DistributorRegisterForm,
): Promise<RegisterResponse | null> {
  const { data } = await post<RegisterResponse>(
    '/distributor/register',
    userData,
  );

  return data || null;
}

export async function logout(): Promise<void> {
  await post<void>('/auth/logout', {});
}

export async function checkAuth() {
  const { data } = await get('/auth/check');
  return data;
}

export async function resetPassword(email: string, role: RoleTypes) {
  const roleRoute = role.toLowerCase();
  await post(`/${roleRoute}/reset-password-request`, { email });
}

export async function changePasswordAfterReset(
  data: ResetPasswordFormValues,
  role: RoleTypes,
  token: string,
) {
  const roleRoute = role.toLowerCase();
  await post(
    `/${roleRoute}/reset-password?token=${encodeURIComponent(token)}`,
    {
      newPassword: data.password,
    },
  );
}

// guard
export const AuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuthStatus();

  if (isLoading) {
    return <div className="wrapper">Loading...</div>; // change to a nicer spinner
  }

  if (!isAuthenticated) {
    window.location.href = '/';
  }

  return <Outlet />;
};

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles }) => {
  const userRole = getUserRoleFromCookie();

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />; // TODO: create unauthorized page
  }

  return <Outlet />;
};
