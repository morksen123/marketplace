import { Button } from '@/components/ui/button';
import { useAuthActions } from '../hooks/useAuthActions';

export const LogoutButton = () => {
  const { logout } = useAuthActions();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Button
      variant="ghost"
      className="mt-4 w-full justify-between"
      onClick={handleLogout}
    >
      Logout
      <span className="ml-2">→</span>
    </Button>
  );
};
