import { BuyerSignUpForm } from '@/features/Authentication/components/BuyerSignUpForm';
import { DistributorSignUpForm } from '@/features/Authentication/components/DistributorSignUpForm';
import { RoleTypes } from '@/features/Authentication/types/auth';
import { useLocation } from 'react-router-dom';

export const RegisterRoute = () => {
  const location = useLocation();
  const { role } = location.state as { role: RoleTypes };

  return (
    <div className="wrapper">
      {role === 'BUYER' ? <BuyerSignUpForm /> : <DistributorSignUpForm />}
    </div>
  );
};
