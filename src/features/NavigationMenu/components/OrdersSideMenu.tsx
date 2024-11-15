import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Package, RefreshCcw, AlertCircle } from 'lucide-react';

interface OrdersSideMenuProps {
  userType: 'buyer' | 'distributor';
}

export const OrdersSideMenu: React.FC<OrdersSideMenuProps> = ({ userType }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const baseRoute = userType === 'buyer' ? '/buyer' : '/distributor';

  const menuItems = [
    { 
      text: 'All Orders', 
      path: `${baseRoute}/orders`,
      icon: <Package className="w-5 h-5" />
    },
    { 
      text: 'Refunds', 
      path: `${baseRoute}/orders/refunds`,
      icon: <RefreshCcw className="w-5 h-5" />
    },
    { 
      text: 'Disputes', 
      path: `${baseRoute}/orders/disputes`,
      icon: <AlertCircle className="w-5 h-5" />
    },
  ];

  return (
    <div className="w-64 min-h-screen border-r border-gray-200">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Orders Management</h2>
        <nav>
          <ul className="space-y-3">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={index}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className={`mr-3 ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                      {item.icon}
                    </span>
                    {item.text}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};