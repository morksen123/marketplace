import { LightbulbIcon } from 'lucide-react';
import React from 'react';

export const SaveAddressPrompt: React.FC = () => {
  return (
    <div className="bg-blue-50 rounded-lg p-3 shadow-sm">
      <div className="flex items-center">
        <div className="bg-blue-100 rounded-full p-2 mr-4">
          <LightbulbIcon className="text-blue-600" size={24} />
        </div>
        <div>
          <p className="text-blue-800 font-semibold text-sm">Pro tip</p>
          <p className="text-blue-700 text-xs mt-1">
            Save your shipping or billing addresses to your{' '}
            <span className="font-semibold text-blue-600 ">address book</span>{' '}
            for faster checkout!
          </p>
        </div>
      </div>
    </div>
  );
};
