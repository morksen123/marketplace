import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthActions } from '@/features/Authentication/hooks/useAuthActions';

interface ProfileLinksProps {
  links: Array<{text: string, path: string}>;
}

const ProfileLinks: React.FC<ProfileLinksProps> = ({ links }) => {
  const { logout } = useAuthActions();
  const navigate = useNavigate();

  const handleClick = (text: string, path: string) => {
    if (text === 'Logout') {
      logout();
    } else {
      navigate(path);
    }
  };

  return (
    <div className="mt-8">
      <ul className="space-y-4">
        {links.map(({ text, path }) => (
          <li key={text}>
            <Button 
              variant="ghost" 
              className="w-full justify-between"
              onClick={() => handleClick(text, path)}
            >
              {text}
              <span className="ml-2">→</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileLinks;