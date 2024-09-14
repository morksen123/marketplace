import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';

import { handleSuccessApi } from '@/lib/api-client';
import { login, logout, register } from '@/lib/auth';
import { userAtom } from '@/store/authAtoms';
import { useNavigate } from 'react-router-dom';
import {
  LoginCredentials,
  RegisterForm,
  ROLES,
  RoleTypes,
} from '../types/auth';

export function useAuthActions() {
  const [, setUser] = useAtom(userAtom);
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
      setUser(data);
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
      navigate('/');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterForm) => {
      return register(data);
    },
    onSuccess: (data) => {
      if (data) {
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
    register: registerMutation.mutate,
  };
}
