import React from 'react';
import ProfileManagement from '@/components/profile/ProfileManagement';
import { distributorProfileDefaultValues } from '../constants';

const DistributorProfileManagement: React.FC = () => {
  const API_BASE_URL = 'http://localhost:8080/api';

  const fetchProfile = async () => {
    // Implement fetch logic here
    try {
      const response = await fetch(`${API_BASE_URL}/distributor/profile`, {
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
    return distributorProfileDefaultValues;
  };

  const updateProfile = async (profile: any) => {
    // Implement update logic here
    try {
      const response = await fetch(
        `${API_BASE_URL}/distributor/profile/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(profile),
        },
      );
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
    {
      label: 'Distributor Name',
      name: 'distributorName',
      type: 'text',
      editable: false,
    },
    {
      label: 'Company Address',
      name: 'address',
      type: 'text',
      editable: false,
    },
    {
      label: 'Business Registration Number',
      name: 'uen',
      type: 'text',
      editable: false,
    },
    {
      label: 'Primary Contact Name',
      name: 'contactName',
      type: 'text',
      editable: true,
    },
    {
      label: 'Primary Contact Email',
      name: 'email',
      type: 'email',
      editable: true,
    },
    {
      label: 'Primary Phone Number',
      name: 'contactNumber',
      type: 'tel',
      editable: true,
    },
  ];

  const greeting = (profile: any) => `${profile.distributorName} Profile`;

  return (
    <div>
      <ProfileManagement
        fetchProfile={fetchProfile}
        updateProfile={updateProfile}
        profileFields={profileFields}
        greeting={greeting}
        hasProfilePicture={false}
      />
    </div>
  );
};

export default DistributorProfileManagement;
