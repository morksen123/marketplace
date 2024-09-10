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
    <div className="absolute top-0 ml-28 h-full flex flex-col">
      <div className="mb-8 text-start">
        <h1
          className="text-white text-8xl font-bold"
          style={{ fontFamily: 'Slackey' }}
        >
          GudFood
        </h1>
        <h2 className="text-white text-lg mt-2 ml-2">
          Be a part of the mission to reduce food waste
        </h2>
      </div>
      {signInFormState !== 'Closed' ? (
        <SignInForm state={signInFormState} onClose={handleFormToggle} />
      ) : (
        <div className="ml-2">
          <p className="text-primary  text-lg mb-4 text-left">I am a:</p>
          <div className="flex space-x-4">
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
        </div>
      )}
    </div>
  );
};
