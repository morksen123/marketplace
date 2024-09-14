import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import StoreMallDirectoryOutlinedIcon from '@mui/icons-material/StoreMallDirectoryOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';

export const DistributorNavMenu = () => {
  return (
    <nav className="bg-white shadow-md w-full">
      <div className="w-full p-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="text-black text-2xl font-bold pl-6">
            {' '}
            {/* Added left padding */}
            <a href="/">GudFood</a>
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
            <button className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 flex items-center">
              <StoreMallDirectoryOutlinedIcon className="mr-2" /> Store
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
