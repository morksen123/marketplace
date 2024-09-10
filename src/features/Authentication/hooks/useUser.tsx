import { User } from '@/types/api';
import { atom, useAtom } from 'jotai';

export const useUser = () => {
  const userAtom = atom<User | null>(null);
  const [user, setUser] = useAtom(userAtom);

  const updateUser = (newUserData: Partial<User>) => {
    setUser((currentUser) =>
      currentUser ? { ...currentUser, ...newUserData } : null,
    );
  };

  return { user, setUser, updateUser };
};
