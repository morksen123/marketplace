import logo from '@/assets/gudfood-logo.png';
import { Button } from '@/components/ui/button';
import { useAuthActions } from '@/features/Authentication/hooks/useAuthActions';
import { NotificationDropdown } from '@/features/Notifications/components/NotificationDropdown';
import { notificationsAtom } from '@/store/notificationAtoms';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import StoreMallDirectoryOutlinedIcon from '@mui/icons-material/StoreMallDirectoryOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const DistributorNavMenu = () => {
  const navigate = useNavigate();
  const { logout } = useAuthActions();
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  // Handle account dropdown toggle
  const toggleAccountDropdown = () => {
    setShowAccountDropdown(!showAccountDropdown);
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
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

  useEffect(() => {
    console.log('Notifications in DistributorNavMenu:', notifications);
  }, [notifications]);

  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    console.log(
      'Notification dropdown toggled. Current state:',
      !showNotificationDropdown,
    );
  };

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
      <div className="w-full p-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="pl-6">
            <Link to="/distributor/home">
              <img src={logo} alt="GudFood Logo" className="h-12" />
            </Link>
          </div>

          {/* Navigation Links with Icons */}
          <div className="flex items-center space-x-12 pr-6">
            <Link
              to="/distributor/leaderboard"
              className="text-black hover:text-gray-600 flex items-center"
            >
              <LeaderboardOutlinedIcon className="mr-1" /> Leaderboard
            </Link>
            <Link
              to="/distributor/faq"
              className="text-black hover:text-gray-600 flex items-center"
            >
              <SupportAgentOutlinedIcon className="mr-1" /> FAQ
            </Link>
            <Link
              to="/inventory-management"
              className="text-black hover:text-gray-600 flex items-center"
            >
              <InventoryOutlinedIcon className="mr-1" /> Inventory
            </Link>
            <Link
              to="/distributor/orders"
              className="text-black hover:text-gray-600 flex items-center"
            >
              <LocalShippingIcon className="mr-1" /> Orders
            </Link>
            <Link
              to="/distributor/promotions"
              className="text-black hover:text-gray-600 flex items-center"
            >
              <LoyaltyIcon className="mr-1" /> Promotions
            </Link>
            <Link
              to="/distributor/profile/chats"
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
                  userRole="distributor"
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
                  {window.location.pathname !== '/distributor/profile' ? (
                    <Link
                      to="/distributor/profile"
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
            <Link to="/distributor/home">
              <Button variant="secondary" className="button-green">
                <StoreMallDirectoryOutlinedIcon className="mr-2" /> Store
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
