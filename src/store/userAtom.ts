import { atom } from 'jotai';
import { RoleTypes } from '@/features/Authentication/types/auth';

interface UserInfo {
  id: number | null;
  role: RoleTypes | null;
}

export const userInfoAtom = atom<UserInfo>({
  id: null,
  role: null,
});

export const setUserInfoAtom = atom(
  null,
  (get, set, userInfo: Partial<UserInfo>) => {
    const currentUserInfo = get(userInfoAtom);
    set(userInfoAtom, { ...currentUserInfo, ...userInfo });
  }
);