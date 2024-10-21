import { useAtom } from 'jotai';
import { userInfoAtom, setUserInfoAtom } from '@/store/userAtom';
import { useEffect } from 'react';

export function useUser() {
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);

  useEffect(() => {
    // Check if userInfo is null and try to retrieve from storage
    if (!userInfo.id || !userInfo.role) {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    }
  }, []);

  return {
    userId: userInfo.id,
    userRole: userInfo.role,
    setUserInfo,
  };
}
