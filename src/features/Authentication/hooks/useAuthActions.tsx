import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';

import { login, logout } from '@/lib/auth';
import { userAtom } from '@/store/authAtoms';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials, ROLES, RoleTypes } from '../types/auth';

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
      queryClient.invalidateQueries({ queryKey: ['authCheck'] });

      if (data?.role === ROLES.BUYER) {
        navigate('/buyer-home');
      } else if (data?.role === ROLES.DISTRIBUTOR) {
        navigate('/distributor-home');
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['authCheck'] });
    },
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
  };
}
