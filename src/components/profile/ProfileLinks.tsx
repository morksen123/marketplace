import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ProfileLinksProps {
  links: Array<{text: string, path: string}>;
}

const ProfileLinks: React.FC<ProfileLinksProps> = ({ links }) => {
  return (
    <div className="mt-8">
      <ul className="space-y-4">
        {links.map(({ text, path }) => (
          <li key={text}>
            <Link to={path} style={{ textDecoration: 'none' }}>
              <Button variant="ghost" className="w-full justify-between">
                {text}
                <span className="ml-2">→</span>
              </Button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileLinks;