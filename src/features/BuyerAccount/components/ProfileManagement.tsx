import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProfileManagement: React.FC = () => {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<[] | null>(null);

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
    { label: 'First Name', type: 'text', defaultValue: 'John' },
    { label: 'Last Name', type: 'text', defaultValue: 'Doe' },
    { label: 'Email Address', type: 'email', defaultValue: 'johndoe@email.com' },
    { label: 'Home Address', type: 'text', defaultValue: 'Block 123 Your Mom Avenue #01-01 456123' },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Hello, {userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : 'John Doe'}</h1>
          <h2 className="text-lg font-semibold mb-6">My Details</h2>
          
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
            <form className="space-y-6">
            {formFields.map(({ label, type, defaultValue }) => (
              <div key={label}>
                <Label className="block text-sm font-medium text-gray-700">
                  {label}
                </Label>
                <Input 
                  type={type}
                  defaultValue={defaultValue}
                  className="mt-1 block w-full"
                />
              </div>
            ))}
            <Button variant="outline" className="w-full">Save My New Details</Button>
          </form>

              <div className="mt-8">
                <ul className="space-y-4">
                  {['Change Password', 'Notifications', 'Purchasing Preferences', 'Account Deactivation'].map((text) => (
                    <li key={text}>
                      <Button variant="ghost" className="w-full justify-between">
                        {text}
                        <span className="ml-2">→</span>
                      </Button>
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
