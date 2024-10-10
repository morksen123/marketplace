import { InfoIcon } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export const SaveAddressPrompt: React.FC = () => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start">
        <div className="p-2 mr-4">
          <InfoIcon className="h-5 w-5 text-secondary" />
        </div>
        <p className="text-secondary text-sm">
          Pro tip: Save your shipping and billing addresses to your{' '}
          <Link
            to="/buyer/profile/my-addresses"
            className="font-semibold text-secondary hover:text-green-900 underline underline-offset-2 transition-colors duration-200"
          >
            address book
          </Link>{' '}
          for faster checkout next time!
        </p>
      </div>
    </div>
  );
};
