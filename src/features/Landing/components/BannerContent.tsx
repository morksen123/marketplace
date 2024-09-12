import PersonOutlinedIcon from '@/assets/person.svg';
import DistributorOutlinedIcon from '@/assets/shop.svg';
import { Button } from '@/components/ui/button';
import SignInForm from '@/features/Authentication/components/SignInForm';
import { SignInFormState } from '@/features/Authentication/types/form-state';
import { UserRole } from '@/types/api';
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
  const [userRole, setUserRole] = useState<UserRole>();

  const handleFormToggle = useCallback((state: SignInFormState) => {
    setSignInFormState(state);
    if (state !== 'Closed') {
      setUserRole(state);
    }
  }, []);

  const isFormOpen = signInFormState !== 'Closed';

  return (
    <div className="absolute top-0 ml-28 h-full flex flex-col justify-center">
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

      {/* Parent container with reserved space */}
      <div className="ml-2 relative min-h-[400px] md:min-h-[300px] lg:min-h-[350px]">
        {/* Buttons */}
        <div
          className={`flex flex-col transition-all duration-500 ease-in-out ${
            isFormOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <p className="text-primary text-lg mb-4 text-left">I am a:</p>
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

        {/* Sign-in form */}
        <div
          className={`absolute top-0 left-0 w-full transition-all duration-500 ease-in-out ${
            isFormOpen
              ? 'opacity-100 visible'
              : 'opacity-0 invisible pointer-events-none'
          }`}
        >
          {userRole && (
            <SignInForm userRole={userRole} onClose={handleFormToggle} />
          )}
        </div>
      </div>
    </div>
  );
};
