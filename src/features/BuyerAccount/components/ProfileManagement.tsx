import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '@/features/Authentication/hooks/useAuthActions';
import ProfileManagement from '@/components/profile/ProfileManagement';
import { LogoutButton } from '@/features/Authentication/components/LogoutButton';
import { userDetailDefaultValues } from '../constants';
import { BuyerNavMenu } from '@/features/NavigationMenu/components/BuyerNavMenu';

const BuyerProfileManagement: React.FC = () => {
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

  const greeting = (profile: any) =>
    `Hello, ${profile.firstName} ${profile.lastName}`;

  return (
    <div>
      <ProfileManagement
        fetchProfile={fetchProfile}
        updateProfile={updateProfile}
        profileFields={profileFields}
        greeting={greeting}
        hasProfilePicture={true}
      />
    </div>
  );
};

export default BuyerProfileManagement;
