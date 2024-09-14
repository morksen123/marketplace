import React from 'react';
import ProfileManagement from '@/components/profile/ProfileManagement';
import { LogoutButton } from '@/features/Authentication/components/LogoutButton';
import { userDetailDefaultValues } from '../constants';

const BuyerProfileManagement: React.FC = () => {
  const API_BASE_URL = 'http://localhost:8080/api';

  const fetchProfile = async () => {
    // Implement fetch logic here
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
    //return userDetailDefaultValues;
  };

  const updateProfile = async (profile: any) => {
    // Implement update logic here
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtdXJzeWlkQGVtYWlsLmNvbSIsImlhdCI6MTcyNjI1MzU1OSwiZXhwIjoxNzI2ODU4MzU5fQ.2d2oHe7-BaHJW5U3IJHw7_6dII24tMv33clYv9ncWjA`,
        },
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
    {
      label: 'Shipping Address',
      name: 'shippingAddresses',
      type: 'text',
      editable: true,
    }, // to change to fit multiple addresses
  ];

  const links = [
    { text: 'Change Password', path: '/buyer/profile/change-password' },
    { text: 'Notifications', path: '/buyer/profile/notifications' },
    {
      text: 'Purchasing Preferences',
      path: '/buyer/profile/purchasing-preferences',
    },
    {
      text: 'Account Deactivation',
      path: '/buyer/profile/account-deactivation',
    },
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
      />
      {/* might shift this logout button to somewhere else */}
      <LogoutButton />
    </div>
  );
};

export default BuyerProfileManagement;
