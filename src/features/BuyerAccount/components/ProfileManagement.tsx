import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userDetailDefaultValues } from '../constants';
import { Link } from 'react-router-dom';

const ProfileManagement: React.FC = () => {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>(userDetailDefaultValues);

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
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
          <h1 className="text-2xl font-bold mb-10">Hello, {userDetails.firstName} {userDetails.lastName}</h1>
          
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left column: Profile picture and change button */}
            <div className="md:w-1/3 flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500">No Image Found</span>
                )}
              </div>
              <Input type="file" onChange={handleFileChange} className="w-full mt-4" accept="image/*"/>
            </div>

            {/* Right column: Form and other components */}
            <div className="md:w-2/3 w-full">
            <h2 className="text-lg font-semibold mb-6 text-left">My Details</h2>
            <form className="space-y-6">
            {formFields.map(({ label, type, name }) => (
              <div key={name}>
                <Label className="block text-sm font-medium text-gray-700">
                  {label}
                </Label>
                <Input 
                  type={type}
                  defaultValue={userDetails[name]}
                  className="mt-1 block w-full"
                />
              </div>
            ))}
            <Button variant="secondary" className="w-full">Save My New Details</Button>
          </form>

              <div className="mt-8">
                <ul className="space-y-4">
                  {[
                    { text: 'Change Password', path: '/profile/change-password' },
                    { text: 'Notifications', path: '/profile/notifications' },
                    { text: 'Purchasing Preferences', path: '/profile/purchasing-preferences' },
                    { text: 'Account Deactivation', path: '/profile/account-deactivation' }
                  ].map(({ text, path }) => (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
