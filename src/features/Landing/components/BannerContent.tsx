import PersonOutlinedIcon from '@/assets/person.svg';
import DistributorOutlinedIcon from '@/assets/shop.svg';
import { Button } from '@/components/ui/button';
import SignInForm from '@/features/Authentication/components/SignInForm';
import { SignInFormState } from '@/features/Authentication/types/form-state';
import { useCallback, useState } from 'react';

const UserTypeButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
  <Button className="w-full sm:w-36 h-14" onClick={onClick}>
    {icon}
    <p className="ml-2 font-semibold">{label}</p>
  </Button>
);

export const BannerContent: React.FC = () => {
  const [signInFormState, setSignInFormState] =
    useState<SignInFormState>('Closed');

  const handleFormToggle = useCallback(
    (state: SignInFormState) => setSignInFormState(state),
    [],
  );

  return (
    <div className="absolute top-0 left-10 h-full flex flex-col justify-center">
      {signInFormState !== 'Closed' ? (
        <SignInForm state={signInFormState} onClose={handleFormToggle} />
      ) : (
        <>
          <p className="text-primary ml-20 text-lg mb-4 text-left">I am a:</p>
          <div className="ml-20 flex space-x-4">
            <UserTypeButton
              icon={<PersonOutlinedIcon />}
              label="Buyer"
              onClick={() => handleFormToggle('Buyer')}
            />
            <UserTypeButton
              icon={<DistributorOutlinedIcon />}
              label="Distributor"
              onClick={() => handleFormToggle('Distributor')}
            />
          </div>
        </>
      )}
    </div>
  );
};
