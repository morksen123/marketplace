// import { useState } from 'react';
import { Button } from '@/components/ui/button';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/gudfood-logo.png';

{
  /* Icons */
}

interface BuyerNavMenuProps {
  showTabs?: boolean;
}

export const BuyerNavMenu: React.FC<BuyerNavMenuProps> = ({
  showTabs = true,
}) => {
  const [selectedTab, setSelectedTab] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const tabs = [
    'Home',
    'Our Mission',
    'Fruits & Vegetables',
    'Canned Goods',
    'Frozen',
    'Sale',
  ];

  // Handle input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buyer/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
              href="/chats"
              className="text-black hover:text-gray-600 flex items-center"
            >
              <SmsOutlinedIcon className="mr-1" /> Chats
            </a>
            <a
              href="/buyer/profile"
              className="text-black hover:text-gray-600 flex items-center"
            >
              <PersonOutlineOutlinedIcon className="mr-1" /> Account
            </a>
            <a
              href="/account"
              className="text-black hover:text-gray-600 flex items-center"
            >
              <NotificationsNoneOutlinedIcon className="mr-1" /> Notifications
            </a>
            <Button className="button button-green">
              <ShoppingCartOutlinedIcon className="mr-2" /> Cart
            </Button>
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
