import { useNavigate } from 'react-router-dom';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useState, useRef, useEffect } from 'react';
import logo from '../../../assets/gudfood-logo.png';
import { useAuthActions } from '@/features/Authentication/hooks/useAuthActions';

interface BuyerNavMenuProps {
  showTabs?: boolean;
}

export const BuyerNavMenu: React.FC<BuyerNavMenuProps> = ({
  showTabs = true,
}) => {
  const [selectedTab, setSelectedTab] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthActions();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tabs = [
    'Home',
    'Our Mission',
    'Fruits & Vegetables',
    'Canned Goods',
    'Frozen',
    'Sale',
  ];

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buyer/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
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
            <a href="/buyer/home">
              <img src={logo} alt="GudFood Logo" className="h-12" />
            </a>
          </div>

          {/* Search Bar */}
          <div className="flex-grow mx-4 max-w-md">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleInputChange}
                className="w-full py-2 px-4 rounded-lg focus:outline-none border border-gray-300 bg-gray-100 text-black"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-1.5 mr-2"
              >
                <SearchIcon className="w-6 h-6 text-gray-600" />
              </button>
            </form>
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
              href="/buyer/profile/chats"
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
                  {window.location.pathname !== '/buyer/profile' ? (
                    <a
                      href="/buyer/profile"
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
            <button className="button button-green">
              <ShoppingCartOutlinedIcon className="mr-2" /> Cart
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      {showTabs && (
        <div className="bg-white w-full">
          <div className="flex justify-between">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`py-4 px-4 text-black focus:outline-none flex-grow ${
                  selectedTab === tab
                    ? 'border-b-2 border-green-500 text-green-500'
                    : 'hover:text-green-500'
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
