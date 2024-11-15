import logo from '@/assets/gudfood-logo.png';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface LandingNavBarProps {
  showTabs?: boolean;
}

export const LandingNavBar: React.FC<LandingNavBarProps> = ({
  showTabs = true,
}) => {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState('Home');

  const tabs = [
    { name: 'Home', route: '/' },
    { name: 'About Us', route: '/about' },
    { name: 'Blogs', route: '/blogs' },
  ];

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.route === location.pathname);
    if (currentTab) {
      setSelectedTab(currentTab.name);
    }
  }, [location.pathname]);

  return (
    <nav className="bg-white w-full border-b border-gray-200 shadow-lg">
      <div className="w-full px-4 pt-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="pl-6 flex items-center">
            <Link to="/">
              <img src={logo} alt="GudFood Logo" className="h-12" />
            </Link>
          </div>

          {/* Tabs Menu */}
          {showTabs && (
            <div className="flex-1 ml-8">
              <div className="flex justify-end">
                {tabs.map((tab) => (
                  <Link
                    key={tab.name}
                    to={tab.route}
                    className={`py-4 px-12 text-black focus:outline-none text-center ${
                      selectedTab === tab.name
                        ? 'border-b-2 border-green-500 text-green-500 mb-[-2px]'
                        : 'hover:text-green-500'
                    }`}
                  >
                    {tab.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
