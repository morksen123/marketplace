import { RegisterHeader } from '@/features/Authentication/components/RegisterHeader';
import { SignUpForm } from '@/features/Authentication/components/SignUpForm';
import { RoleTypes } from '@/features/Authentication/types/auth';
import { useLocation } from 'react-router-dom';

export const RegisterRoute = () => {
  const location = useLocation();
  const { role } = location.state as { role: RoleTypes };

  return (
    <div className="wrapper">
      <RegisterHeader role={role} />
      <SignUpForm />
    </div>
  );
};
