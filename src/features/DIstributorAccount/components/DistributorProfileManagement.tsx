import React from 'react';
import ProfileManagement from '@/components/profile/ProfileManagement';
import { distributorProfileDefaultValues } from '../constants';

const DistributorProfileManagement: React.FC = () => {
  const fetchProfile = async () => {
    // Implement fetch logic here
    return distributorProfileDefaultValues;
  };

  const updateProfile = async (profile: any) => {
    // Implement update logic here
  };

  const profileFields = [
    { label: 'Company Name', name: 'companyName', type: 'text', editable: false },
    { label: 'Company Address', name: 'companyAddress', type: 'text', editable: false },
    { label: 'Business Registration Number', name: 'businessRegistrationNumber', type: 'text', editable: false },
    { label: 'Primary Contact Name', name: 'primaryContactName', type: 'text', editable: true },
    { label: 'Primary Contact Email', name: 'primaryContactEmail', type: 'email', editable: true },
    { label: 'Primary Phone Number', name: 'primaryPhoneNumber', type: 'tel', editable: true },
  ];

  const links = [
    { text: 'Change Password', path: '/profile/change-password' },
    { text: 'Notifications', path: '/profile/notifications' },
    { text: 'Listing Preferences', path: '/profile/listing-preferences' },
    { text: 'Account Deactivation', path: '/profile/account-deactivation' }
  ];

  const greeting = (profile: any) => `${profile.companyName} Profile`;

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

export default DistributorProfileManagement;