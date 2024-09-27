import logo from '@/assets/gudfood-logo.png';
import { Button } from '@/components/ui/button';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import StoreMallDirectoryOutlinedIcon from '@mui/icons-material/StoreMallDirectoryOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import { Link } from 'react-router-dom';

export const DistributorNavMenu = () => {
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
              to="/faq"
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
              to="/chats"
              className="text-black hover:text-gray-600 flex items-center"
            >
              <SmsOutlinedIcon className="mr-1" /> Chats
            </Link>
            <Link
              to="/distributor/profile"
              className="text-black hover:text-gray-600 flex items-center"
            >
              <PersonOutlineOutlinedIcon className="mr-1" /> Account
            </Link>
            <Link
              to="/account"
              className="text-black hover:text-gray-600 flex items-center"
            >
              <NotificationsNoneOutlinedIcon className="mr-1" /> Notifications
            </Link>
            <Link to="/distributor/home">
              <Button variant="secondary">
                <StoreMallDirectoryOutlinedIcon className="mr-2" /> Store
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
