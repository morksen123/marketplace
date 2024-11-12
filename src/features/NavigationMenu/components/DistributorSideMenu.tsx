import React from 'react';
import { useNavigate } from 'react-router-dom';

export const DistributorSideMenu: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: 'Profile Management',
      links: [
        { text: 'User Information', path: '/distributor/profile' },
        { text: 'Change Password', path: '/distributor/profile/change-password' },
        { text: 'Account Deactivation', path: '/distributor/profile/account-deactivation' },
      ]
    },
    {
      title: 'Communication',
      links: [
        { text: 'Chats', path: '/distributor/profile/chats' },
      ]
    },
    {
      title: 'Business',
      links: [
        { text: 'Transactions', path: '/distributor/transactions' },
        { text: 'Sales', path: '/distributor/sales' },
      ]
    },
    {
      title: 'Sustainability',
      links: [{ text: 'Waste Audit', path: '/distributor/waste-audit' }],
    },
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
