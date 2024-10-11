import { LightbulbIcon } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export const SaveAddressPrompt: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center">
        <div className="bg-blue-100 rounded-full p-2 mr-4">
          <LightbulbIcon className="text-blue-600" size={24} />
        </div>
        <div>
          <p className="text-blue-800 font-semibold text-sm">Pro tip</p>
          <p className="text-blue-700 text-xs mt-1">
            Save your shipping and billing addresses to your{' '}
            <Link
              to="/buyer/profile/my-addresses"
              className="font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors duration-200"
            >
              address book
            </Link>{' '}
            for faster checkout!
          </p>
        </div>
      </div>
    </div>
  );
};
