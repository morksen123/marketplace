import React from 'react';
import ProfileManagement from '@/components/profile/ProfileManagement';
import { userDetailDefaultValues } from '../constants';

const BuyerProfileManagement: React.FC = () => {
  const fetchProfile = async () => {
    // Implement fetch logic here
    return userDetailDefaultValues;
  };

  const updateProfile = async (profile: any) => {
    // Implement update logic here
  };

  const profileFields = [
    { label: 'First Name', name: 'firstName', type: 'text', editable: true },
    { label: 'Last Name', name: 'lastName', type: 'text', editable: true },
    { label: 'Email Address', name: 'emailAddress', type: 'email', editable: true },
    { label: 'Home Address', name: 'homeAddress', type: 'text', editable: true },
  ];

  const links = [
    { text: 'Change Password', path: '/buyer/profile/change-password' },
    { text: 'Notifications', path: '/buyer/profile/notifications' },
    { text: 'Purchasing Preferences', path: '/buyer/profile/purchasing-preferences' },
    { text: 'Account Deactivation', path: '/buyer/profile/account-deactivation' }
  ];

  const greeting = (profile: any) => `Hello, ${profile.firstName} ${profile.lastName}`;

  return (
    <ProfileManagement
      fetchProfile={fetchProfile}
      updateProfile={updateProfile}
      profileFields={profileFields}
      links={links}
      greeting={greeting}
    />
  );
};

export default BuyerProfileManagement;
