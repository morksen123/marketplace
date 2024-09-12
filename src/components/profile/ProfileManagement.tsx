import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import ProfileForm from './ProfileForm';
import ProfileLinks from './ProfileLinks';

interface ProfileManagementProps {
  fetchProfile: () => Promise<any>;
  updateProfile: (profile: any) => Promise<void>;
  profileFields: Array<{label: string, name: string, type: string, editable: boolean}>;
  links: Array<{text: string, path: string}>;
  greeting?: (profile: any) => string;
}

const ProfileManagement: React.FC<ProfileManagementProps> = ({
  fetchProfile,
  updateProfile,
  profileFields,
  links,
  greeting
}) => {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await fetchProfile();
      setProfile(data);
      setEditedProfile(data);
    };
    loadProfile();
  }, [fetchProfile]);

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Edit button clicked");
    e.preventDefault();
    setIsEditing(true);
  };

  const handleCancel = () => {
    console.log("Cancel button clicked");
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    console.log("Save button clicked");
    await updateProfile(editedProfile);
    setProfile(editedProfile);
    setIsEditing(false);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleNonEditableFieldClick = () => {
    console.log("Non editable field clicked");
    setAlertMessage("To edit this field, please contact our help team at help@gudfood.com.");
    setTimeout(() => setAlertMessage(null), 5000); // Hide alert after 5 seconds
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {greeting && <h1 className="text-2xl font-bold mb-4">{greeting(profile)}</h1>}
      
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
  );
};

export default ProfileManagement;