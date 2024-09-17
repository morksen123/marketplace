import { RoleTypes } from '../types/auth';

interface RegisterHeadProps {
  role: RoleTypes;
}

export const RegisterHeader = ({ role }: RegisterHeadProps) => {
  const roleAction = role === 'BUYER' ? 'Buy' : 'Sell';
  return (
    <>
      <h1 className="text-2xl mb-2">
        Join the <span className="font-bold">Gud</span>food Movement
      </h1>
      <p className="mb-6">
        {`Create an Account to ${roleAction} Smart, Save More, and Reduce Waste!`}
      </p>
    </>
  );
};
