import { z } from 'zod';
import {
  BuyerSignUpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schema';

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

export type BuyerRegisterForm = z.infer<typeof BuyerSignUpSchema>;

export interface DistributorRegisterForm {
  distributorName: string;
  address: string;
  contactNumber: string;
  uen: string;
  username: string;
  password: string;
  confirmPassword: string; // confirm password is not needed in the server
  contactName: string;
  email: string;
  proofOfAddress: string;
  bizProfile: string;
}

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
