import React from 'react';
import { useNavigate } from 'react-router-dom';

export const DistributorSideMenu: React.FC = () => {
  const navigate = useNavigate();

  const links = [
    {text: 'My Profile',path: '/distributor/profile',},
    { text: 'Change Password', path: '/distributor/profile/change-password' },
    { text: 'Notifications', path: '/distributor/profile/notifications' },
    {text: 'Listing Preferences', path: '/distributor/profile/listing-preferences'},
    {text: 'Account Deactivation', path: '/distributor/profile/account-deactivation',},
  ];

  return (
    <div className="w-64 min-h-screen p-4 shadow-md">
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index} className="cursor-pointer">
            <button
              onClick={() => navigate(link.path)}
              className="block w-full text-left py-2 px-4 rounded hover:bg-gray-200"
            >
              {link.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
