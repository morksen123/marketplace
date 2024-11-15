import React from 'react';
import { useNavigate } from 'react-router-dom';

export const BuyerSideMenu: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      links: [
        { text: 'Profile', path: '/buyer/profile' }
      ]
    },
    {
      title: 'Profile Management',
      links: [
        { text: 'Profile Details', path: '/buyer/profile-management' },
        { text: 'Change Password', path: '/buyer/profile/change-password' },
        { text: 'Account Deactivation', path: '/buyer/profile/account-deactivation' },
      ]
    },
    {
      title: 'Communication',
      links: [
        { text: 'Chats', path: '/buyer/profile/chats' },
      ]
    },
    {
      title: 'Shopping',
      links: [
        { text: 'Favourites', path: '/buyer/profile/favourites' },
        { text: 'Orders', path: '/buyer/orders' },
        { text: 'Refunds', path: '/buyer/orders/refunds' },
        { text: 'Disputes', path: '/buyer/orders/disputes' },
        { text: 'Transactions', path: '/buyer/transactions' },
      ]
    }
  ];

  return (
    <div className="w-64 min-h-screen p-4 shadow-md">
      <ul className="space-y-6">
        {categories.map((category, categoryIndex) => (
          <li key={categoryIndex}>
            <h3 className="font-bold text-gray-700 mb-2 text-left">{category.title}</h3>
            <ul className="space-y-2">
              {category.links.map((link, linkIndex) => (
                <li key={linkIndex} className="cursor-pointer">
                  <button
                    onClick={() => navigate(link.path)}
                    className="block w-full text-left py-2 px-4 rounded hover:bg-gray-200"
                  >
                    {link.text}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};
