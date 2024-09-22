import React, { useState, useEffect, useRef } from 'react';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import StoreMallDirectoryOutlinedIcon from '@mui/icons-material/StoreMallDirectoryOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import logo from '../../../assets/gudfood-logo.png';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '@/features/Authentication/hooks/useAuthActions';

export const DistributorNavMenu = () => {
  const navigate = useNavigate();
  const { logout } = useAuthActions();
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleStoreClick = () => {
    navigate('/distributor/home');
  };

  // Handle account dropdown toggle
  const toggleAccountDropdown = () => {
    setShowAccountDropdown(!showAccountDropdown);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handle clicking outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="w-full p-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="pl-6">
            <a href="/distributor/home">
              <img src={logo} alt="GudFood Logo" className="h-12" />
            </a>
          </div>

          {/* Navigation Links with Icons */}
          <div className="flex items-center space-x-12 pr-6">
            <a
              href="/faq"
              className="text-black hover:text-gray-600 flex items-center"
            >
              <SupportAgentOutlinedIcon className="mr-1" /> FAQ
            </a>
            <a
              href="/chats"
              className="text-black hover:text-gray-600 flex items-center"
            >
              <SmsOutlinedIcon className="mr-1" /> Chats
            </a>
            <a
              href="/account"
              className="text-black hover:text-gray-600 flex items-center"
            >
              <NotificationsNoneOutlinedIcon className="mr-1" /> Notifications
            </a>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleAccountDropdown}
                className="text-black hover:text-gray-600 flex items-center"
              >
                <PersonOutlineOutlinedIcon className="mr-1" /> Account 
                <ArrowDropDownIcon className={`transition-transform duration-300 ${showAccountDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showAccountDropdown && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10">
                  {window.location.pathname !== '/distributor/profile' ? (
                    <a
                      href="/distributor/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-center"
                    >
                      My Profile
                    </a>
                  ) : (
                    <span className="block px-4 py-2 text-sm text-gray-400 text-center cursor-default">
                      My Profile
                    </span>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            <button
              className="button button-green"
              onClick={handleStoreClick}
            >
              <StoreMallDirectoryOutlinedIcon className="mr-2" /> Store
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
