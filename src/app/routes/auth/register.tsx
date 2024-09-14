import { BuyerSignUpForm } from '@/features/Authentication/components/BuyerSignUpForm';
import { DistributorSignUpForm } from '@/features/Authentication/components/DistributorSignUpForm';
import { RegisterHeader } from '@/features/Authentication/components/RegisterHeader';
import { RoleTypes } from '@/features/Authentication/types/auth';
import { useLocation } from 'react-router-dom';

export const RegisterRoute = () => {
  const location = useLocation();
  const { role } = location.state as { role: RoleTypes };

  return (
    <div className="wrapper">
      <RegisterHeader role={role} />
      {role === 'BUYER' ? <BuyerSignUpForm /> : <DistributorSignUpForm />}
    </div>
  );
};
