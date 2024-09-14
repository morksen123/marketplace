import { SignUpForm } from '@/features/Authentication/components/SignUpForm';

export const RegisterRoute = () => {
  return (
    <div className="wrapper">
      <h1 className="text-2xl mb-2">
        Join the <span className="font-bold">Gud</span>food Movement
      </h1>
      <p className="mb-6">
        Create an Account to Buy Smart, Save More, and Reduce Waste!
      </p>
      <SignUpForm />
    </div>
  );
};
