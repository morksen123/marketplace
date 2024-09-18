import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '@/features/Authentication/hooks/useAuthActions';
import ProfileManagement from '@/components/profile/ProfileManagement';
import { LogoutButton } from '@/features/Authentication/components/LogoutButton';
import { userDetailDefaultValues } from '../constants';
import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';

const BuyerProfileManagement: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthActions();

  const API_BASE_URL = 'http://localhost:8080/api';

  // Fetch profile from backend
  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data;
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Update profile to backend
  const updateProfile = async (profile: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profile),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data;
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const profileFields = [
    { label: 'First Name', name: 'firstName', type: 'text', editable: true },
    { label: 'Last Name', name: 'lastName', type: 'text', editable: true },
    { label: 'Email Address', name: 'email', type: 'email', editable: true },
  ];

  const links = [
    {text: 'My Addresses', path: '/buyer/profile/my-addresses'},
    { text: 'Change Password', path: '/buyer/profile/change-password' },
    { text: 'Notifications', path: '/buyer/profile/notifications' },
    {
      text: 'Purchasing Preferences',
      path: '/buyer/profile/purchasing-preferences',
    },
    {text: 'Favourites', path: '/buyer/profile/favourites'},
    {
      text: 'Account Deactivation',
      path: '/buyer/profile/account-deactivation',
    },
    {text: 'Logout', path: '/logout'}
  ];

  const greeting = (profile: any) =>
    `Hello, ${profile.firstName} ${profile.lastName}`;

  return (
    <div>
      <ProfileManagement
        fetchProfile={fetchProfile}
        updateProfile={updateProfile}
        profileFields={profileFields}
        links={links}
        greeting={greeting}
        hasProfilePicture={true}
      />
    </div>
  );
};

export default BuyerProfileManagement;
