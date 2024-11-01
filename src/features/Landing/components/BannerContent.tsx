import PersonOutlinedIcon from '@/assets/person.svg';
import DistributorOutlinedIcon from '@/assets/shop.svg';
import gudFoodLogo from '@/assets/gudfood-logo.png';
import { Button } from '@/components/ui/button';
import SignInForm from '@/features/Authentication/components/SignInForm';
import { ROLES, SignInFormState } from '@/features/Authentication/types/auth';
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
    useState<SignInFormState>('CLOSED');

  const userRole = signInFormState !== 'CLOSED' ? signInFormState : null;

  const handleFormToggle = useCallback((state: SignInFormState) => {
    setSignInFormState(state);
  }, []);

  const isFormOpen = signInFormState !== 'CLOSED';

  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
      <div className={isFormOpen ? 'mb-20' : 'mb-8'}>
        <img
          src={gudFoodLogo}
          alt="GudFood"
          className="h-70"
        />
        <h2 className="text-black text-2xl mt-2">
          Be a part of the mission to reduce food waste
        </h2>
        <h2 className="text-black font-bold text-lg mt-2 text-[#015A27]">
          Login as a:
        </h2>
      </div>

      {/* Parent container with reserved space */}
      <div className="relative min-h-[400px] md:min-h-[300px] lg:min-h-[350px">
        {/* Buttons */}
        <div
          className={`flex flex-col items-center transition-all duration-500 ease-in-out ${
            isFormOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="flex space-x-4">
            <div className="shadow-lg">
              <UserTypeButton
                icon={<PersonOutlinedIcon />}
                label="Buyer"
                onClick={() => handleFormToggle(ROLES.BUYER)}
              />
            </div>
            <div className="shadow-lg">
              <UserTypeButton
                icon={<DistributorOutlinedIcon />}
                label="Distributor"
                onClick={() => handleFormToggle(ROLES.DISTRIBUTOR)}
              />
            </div>
          </div>
        </div>

        {/* Sign-in form */}
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out ${
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
