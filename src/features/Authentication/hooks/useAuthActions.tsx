import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleSuccessApi } from '@/lib/api-client';
import {
  buyerRegister,
  changePasswordAfterReset,
  distributorRegister,
  login,
  logout,
  resetPassword,
  checkTokenValidity,
} from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import {
  BuyerRegisterForm,
  DistributorRegisterForm,
  LoginCredentials,
  ResetPasswordFormValues,
  ROLES,
  RoleTypes,
} from '../types/auth';

export function useAuthActions() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: ({
      credentials,
      role,
    }: {
      credentials: LoginCredentials;
      role: RoleTypes;
    }) => {
      return login(credentials, role);
    },
    onSuccess: (data) => {
      // Invalidate and refetch authCheck query
      queryClient.invalidateQueries({ queryKey: ['authCheck'] });

      if (data?.role === ROLES.BUYER) {
        navigate('/buyer/home');
      } else if (data?.role === ROLES.DISTRIBUTOR) {
        navigate('/distributor/home');
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      window.location.href = '/';
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ email, role }: { email: string; role: RoleTypes }) =>
      resetPassword(email, role),
  });

  const changePasswordAfterResetMutation = useMutation({
    mutationFn: ({
      data,
      role,
      token,
    }: {
      data: ResetPasswordFormValues;
      role: RoleTypes;
      token: string;
    }) => changePasswordAfterReset(data, role, token),
  });

  const checkTokenValidityMutation = useMutation({
    mutationFn: (token: string) => checkTokenValidity(token),
  });

  const registerBuyerMutation = useMutation({
    mutationFn: (data: BuyerRegisterForm) => {
      return buyerRegister(data);
    },
    onSuccess: (data) => {
      if (data) {
        navigate('/');
        handleSuccessApi(
          'Account Created',
          'Your account has been successfully created. You can now log in.',
        );
      }
    },
  });

  const registerDistributorMutation = useMutation({
    mutationFn: (data: DistributorRegisterForm) => {
      return distributorRegister(data);
    },
    onSuccess: (data) => {
      if (data) {
        navigate('/');
        handleSuccessApi(
          'Account Created',
          'Your account has been successfully created. You can now log in.',
        );
      }
    },
  });

  return {
    login: loginMutation.mutate, // change to mutateAsync if we need the data in the component
    logout: logoutMutation.mutate,
    registerBuyer: registerBuyerMutation.mutate,
    registerDistributor: registerDistributorMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    changePasswordAfterReset: changePasswordAfterResetMutation.mutate,
    checkTokenValidity: checkTokenValidityMutation.mutateAsync,
  };
}
