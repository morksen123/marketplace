import { ROLES } from '@/features/Authentication/types/auth';
import { useLocation, useSearchParams } from 'react-router-dom';
import { BuyerSignUpForm } from '@/features/Authentication/components/BuyerSignUpForm';
import { DistributorSignUpForm } from '@/features/Authentication/components/DistributorSignUpForm';

export const RegisterRoute = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref');
  
  // Default to BUYER role if ref code is present or if role is provided in state
  const role = refCode ? ROLES.BUYER : location.state?.role || ROLES.BUYER;

  return (
    <div className="wrapper">
      {role === ROLES.BUYER ? <BuyerSignUpForm /> : <DistributorSignUpForm />}
    </div>
  );
};
