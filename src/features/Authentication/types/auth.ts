import { z } from 'zod';
import { forgotPasswordSchema, SignUpSchema } from '../schema';

export enum ROLES {
  BUYER = 'BUYER',
  DISTRIBUTOR = 'DISTRIBUTOR',
}

export type RoleTypes = keyof typeof ROLES;

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export interface RoleGuardProps {
  allowedRoles: RoleTypes[];
}

export type SignInFormState = 'CLOSED' | RoleTypes;

export interface LoginCredentials {
  email: string;
  password: string;
}

export type RegisterForm = z.infer<typeof SignUpSchema>;

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
