import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProfileForm from './ProfileForm';
import ProfileLinks from './ProfileLinks';

interface ProfileManagementProps {
  fetchProfile: () => Promise<any>;
  updateProfile: (profile: any) => Promise<void>;
  profileFields: Array<{label: string, name: string, type: string, editable: boolean}>;
  links: Array<{text: string, path: string}>;
  greeting?: (profile: any) => string;
  hasProfilePicture?: boolean;
}

const ProfileManagement: React.FC<ProfileManagementProps> = ({
  fetchProfile,
  updateProfile,
  profileFields,
  links,
  greeting,
  hasProfilePicture = false
}) => {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await fetchProfile();
      setProfile(data);
      setEditedProfile(data);
      setProfilePic(data.profilePic);
    };
    loadProfile();
  }, [fetchProfile]);

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    await updateProfile(editedProfile);
    setProfile(editedProfile);
    setIsEditing(false);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleNonEditableFieldClick = () => {
    setAlertMessage("To edit this field, please contact our help team at help@gudfood.com.");
    setTimeout(() => setAlertMessage(null), 5000); // Hide alert after 5 seconds
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto mt-10">
      {greeting && <h1 className="text-2xl font-bold mb-4">{greeting(profile)}</h1>}
      
      <div className="flex flex-col md:flex-row gap-8">
        {hasProfilePicture && (
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
        )}
        
        <div className={hasProfilePicture ? "md:w-2/3" : "w-full"}>
          {successMessage && (
            <Alert className="mb-4">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {alertMessage && (
            <Alert className="mb-4">
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}

          <ProfileForm
            profile={profile}
            editedProfile={editedProfile}
            isEditing={isEditing}
            profileFields={profileFields}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onChange={setEditedProfile}
            onNonEditableFieldClick={handleNonEditableFieldClick}
          />

          <ProfileLinks links={links} />
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;