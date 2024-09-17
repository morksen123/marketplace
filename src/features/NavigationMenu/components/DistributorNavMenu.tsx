import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import StoreMallDirectoryOutlinedIcon from '@mui/icons-material/StoreMallDirectoryOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import logo from '../../../assets/gudfood-logo.png';

export const DistributorNavMenu = () => {
  return (
    <nav className="bg-white shadow-md w-full">
      <div className="w-full p-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="pl-6">
            <a href="/">
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
              <PersonOutlineOutlinedIcon className="mr-1" /> Account
            </a>
            <a
              href="/account"
              className="text-black hover:text-gray-600 flex items-center"
            >
              <NotificationsNoneOutlinedIcon className="mr-1" /> Notifications
            </a>
            <button className="button button-green">
              <StoreMallDirectoryOutlinedIcon className="mr-2" /> Store
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
