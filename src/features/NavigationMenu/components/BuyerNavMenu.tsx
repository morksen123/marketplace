import logo from '@/assets/gudfood-logo.png';
import { notificationsAtom } from '@/atoms/notificationAtoms';
import { Button } from '@/components/ui/button';
import { useAuthActions } from '@/features/Authentication/hooks/useAuthActions';
import { useCart } from '@/features/Cart/hooks/useCart';
import { NotificationDropdown } from '@/features/Notifications/components/NotificationDropdown';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface BuyerNavMenuProps {
  showTabs?: boolean;
}

interface AdminPromotion {
  id: string;
  title: string;
  description: string;
}

export const BuyerNavMenu: React.FC<BuyerNavMenuProps> = ({
  showTabs = true,
}) => {
  const [selectedTab, setSelectedTab] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const { cartQuantity } = useCart();
  const navigate = useNavigate();
  const { logout } = useAuthActions();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [adminPromotions, setAdminPromotions] = useState<AdminPromotion[]>([]);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { name: 'Home', route: '/buyer/home' },
    { name: 'Sale', route: '/buyer/sale' },
  ];

  useEffect(() => {
    const currentPath = window.location.pathname;
    const currentTab = tabs.find((tab) => tab.route === currentPath);
    if (currentTab) {
      setSelectedTab(currentTab.name);
    }
    fetchAdminPromotions();
  }, []);

  const fetchAdminPromotions = async () => {
    try {
      const response = await fetch('/api/promotions/admin/active', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAdminPromotions(data);
    } catch (error) {
      console.error('Error fetching admin promotions:', error);
    }
  };

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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAccountDropdown(false);
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTabClick = (tabName: string, route: string) => {
    setSelectedTab(tabName);
    navigate(route);
  };

  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    console.log(
      'Notification dropdown toggled. Current state:',
      !showNotificationDropdown,
    );
  };

  useEffect(() => {
    console.log('Notifications in BuyerNavMenu:', notifications);
  }, [notifications]);

  const handleNotificationRead = useCallback(
    (notificationId: string) => {
      console.log('Marking notification as read:', notificationId);
      setNotifications((prevNotifications) => {
        const updatedNotifications = prevNotifications.map((notification) =>
          notification.notificationId.toString() === notificationId
            ? { ...notification, read: true }
            : notification,
        );
        console.log('Updated notifications:', updatedNotifications);
        return updatedNotifications;
      });
    },
    [setNotifications],
  );

  // Calculate unread notifications count
  const unreadNotificationsCount = useMemo(() => {
    const count = notifications.filter(
      (notification) => !notification.read,
    ).length;
    console.log('Unread notifications count:', count);
    return count;
  }, [notifications]);

  return (
    <nav className="bg-white shadow-md w-full">
      {adminPromotions.length > 0 && (
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-4">
          <div className="container mx-auto flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
              <ul className="flex flex-wrap justify-center items-center">
                {adminPromotions.map((promo, index) => (
                  <>
                    <li
                      key={promo.id}
                      className="text-base font-semibold flex items-center"
                    >
                      <span className="text-xl font-bold">
                        ${promo.discountAmount}
                      </span>
                      <span className="ml-2">
                        off orders ${promo.minimumSpend}+
                      </span>
                    </li>
                    {index < adminPromotions.length - 1 && (
                      <span className="mx-4 text-xl">•</span>
                    )}
                  </>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="w-full p-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="pl-6">
            <Link to="/buyer/home">
              <img src={logo} alt="GudFood Logo" className="h-12" />
            </Link>
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
                aria-label="Search"
              >
                <SearchIcon className="w-6 h-6 text-gray-600" />
              </button>
            </form>
          </div>

          {/* Navigation Links with Icons */}
          <div className="flex items-center space-x-12 pr-6">
            <Link
              to="/buyer/leaderboard"
              className="text-black hover:text-gray-600 flex items-center"
            >
              <LeaderboardOutlinedIcon className="mr-1" /> Leaderboard
            </Link>
            <Link
              to="/buyer/faq"
              className="text-black hover:text-gray-600 flex items-center"
            >
              <SupportAgentOutlinedIcon className="mr-1" /> FAQ
            </Link>
            <Link
              to="/buyer/profile/chats"
              className="text-black hover:text-gray-600 flex items-center"
            >
              <SmsOutlinedIcon className="mr-1" /> Chats
            </Link>
            <div className="relative" ref={notificationDropdownRef}>
              <button
                onClick={toggleNotificationDropdown}
                className="text-black hover:text-gray-600 flex items-center"
              >
                <NotificationsNoneOutlinedIcon className="mr-1" /> Notifications
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
              {showNotificationDropdown && (
                <NotificationDropdown
                  notifications={notifications}
                  onClose={() => setShowNotificationDropdown(false)}
                  onNotificationRead={handleNotificationRead}
                  userRole="buyer"
                />
              )}
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleAccountDropdown}
                className="text-black hover:text-gray-600 flex items-center"
              >
                <PersonOutlineOutlinedIcon className="mr-1" /> Account
                <ArrowDropDownIcon
                  className={`transition-transform duration-300 ${
                    showAccountDropdown ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {showAccountDropdown && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10">
                  {window.location.pathname !== '/buyer/profile' ? (
                    <Link
                      to="/buyer/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-center"
                    >
                      My Profile
                    </Link>
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
            <Link to="/buyer/cart">
              <Button variant="secondary" className="relative">
                <ShoppingCartOutlinedIcon className="mr-2 h-4 w-4" />
                Cart
                {cartQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-destructive text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartQuantity}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      {showTabs && (
        <div className="bg-white w-full border-t border-gray-100">
          <div className="flex justify-between">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={`py-4 px-4 text-black focus:outline-none flex-grow ${
                  selectedTab === tab.name
                    ? 'border-b-2 border-green-500 text-green-500'
                    : 'hover:text-green-500'
                }`}
                onClick={() => handleTabClick(tab.name, tab.route)}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
