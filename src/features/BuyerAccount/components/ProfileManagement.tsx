import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogoutButton } from '@/features/Authentication/components/LogoutButton';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userDetailDefaultValues } from '../constants';

const ProfileManagement: React.FC = () => {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>(
    userDetailDefaultValues,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState<UserDetails>(
    userDetailDefaultValues,
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  interface UserDetails {
    [key: string]: string;
  }

  // load current profile pic
  useEffect(() => {
    // fetch current profile pic from API
    // Dummy code to fetch current profile pic from API
    const fetchProfilePic = async () => {
      try {
        const response = await fetch('/api/user/profile-pic');
        if (response.ok) {
          const data = await response.json();
          setProfilePic(data.profilePicUrl);
        } else {
          console.error('Failed to fetch profile picture');
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const response = await fetch('/api/user/details');
        if (response.ok) {
          const data = await response.json();
          setUserDetails(data);
          setEditedDetails(data);
        } else {
          console.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchProfilePic();
    fetchUserDetails();
  }, []);

  // image change and upload method
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you would typically upload the file to your API
      // For this example, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);

      // To do: add API call to upload profile pic and add error handling
      // const formData = new FormData();
      // formData.append('profilePic', file);
      // await fetch('/api/upload-profile-pic', { method: 'POST', body: formData });
    }
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleSave = async () => {
    // TODO: Add API call to save user details
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulating API call
    setUserDetails(editedDetails);
    setIsEditing(false);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCancel = () => {
    setEditedDetails(userDetails);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDetails({
      ...editedDetails,
      [e.target.name]: e.target.value,
    });
  };

  // To do: change this to userDetails once API is ready
  const formFields = [
    { label: 'First Name', type: 'text', name: 'firstName' },
    { label: 'Last Name', type: 'text', name: 'lastName' },
    { label: 'Email Address', type: 'email', name: 'emailAddress' },
    { label: 'Home Address', type: 'text', name: 'homeAddress' },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-10">
            Hello, {userDetails.firstName} {userDetails.lastName}
          </h1>

          {successMessage && (
            <Alert className="mb-4">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Left column: Profile picture and change button */}
            <div className="md:w-1/3 flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">No Image Found</span>
                )}
              </div>
              <Input
                type="file"
                onChange={handleFileChange}
                className="w-full mt-4"
                accept="image/*"
              />
            </div>

            {/* Right column: Form and other components */}
            <div className="md:w-2/3 w-full">
              <h2 className="text-lg font-semibold mb-6 text-left">
                My Details
              </h2>
              <form className="space-y-6">
                {formFields.map(({ label, type, name }) => (
                  <div key={name}>
                    <Label className="block text-sm font-medium text-gray-700">
                      {label}
                    </Label>
                    <Input
                      type={type}
                      name={name}
                      value={
                        isEditing
                          ? editedDetails[name as keyof UserDetails]
                          : userDetails[name as keyof UserDetails]
                      }
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full ${
                        !isEditing ? 'bg-gray-100' : ''
                      }`}
                    />
                  </div>
                ))}
                <div className="flex justify-start space-x-2 mt-4">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} variant="secondary">
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline">
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleEdit} variant="secondary">
                      Edit Profile
                    </Button>
                  )}
                </div>
              </form>

              <div className="mt-8">
                <ul className="space-y-4">
                  {[
                    {
                      text: 'Change Password',
                      path: '/buyer/profile/change-password',
                    },
                    {
                      text: 'Notifications',
                      path: '/buyer/profile/notifications',
                    },
                    {
                      text: 'Purchasing Preferences',
                      path: '/buyer/profile/purchasing-preferences',
                    },
                    {
                      text: 'Account Deactivation',
                      path: '/buyer/profile/account-deactivation',
                    },
                  ].map(({ text, path }) => (
                    <li key={text}>
                      <Link to={path} style={{ textDecoration: 'none' }}>
                        <Button
                          variant="ghost"
                          className="w-full justify-between"
                        >
                          {text}
                          <span className="ml-2">→</span>
                        </Button>
                      </Link>
                    </li>
                  ))}
                </ul>
                {/* might shift this logout button to somewhere else */}
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
