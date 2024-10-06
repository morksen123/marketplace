import React from 'react';
import { useNavigate } from 'react-router-dom';

export const BuyerSideMenu: React.FC = () => {
  const navigate = useNavigate();

  const links = [
    { text: 'My Profile', path: '/buyer/profile' },
    { text: 'My Addresses', path: '/buyer/profile/my-addresses' },
    { text: 'Chats', path: '/buyer/profile/chats' },
    { text: 'Notifications', path: '/buyer/profile/notifications' },
    { text: 'Change Password', path: '/buyer/profile/change-password' },
    {
      text: 'Purchasing Preferences',
      path: '/buyer/profile/purchasing-preferences',
    },
    { text: 'Favourites', path: '/buyer/profile/favourites' },
    {
      text: 'Account Deactivation',
      path: '/buyer/profile/account-deactivation',
    },
    { text: 'Transactions', path: '/buyer/transactions' },
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
