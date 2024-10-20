import { useAtom } from 'jotai';
import { userInfoAtom, setUserInfoAtom } from '@/store/userAtom';

export function useUser() {
  const [userInfo] = useAtom(userInfoAtom);
  const [, setUserInfo] = useAtom(setUserInfoAtom);

  return {
    userId: userInfo.id,
    userRole: userInfo.role,
    setUserInfo,
  };
}

