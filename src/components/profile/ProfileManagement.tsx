import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProfileForm from './ProfileForm';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

// AWS S3 configuration
const s3Client = new S3Client({
  region: 'ap-southeast-2',
  credentials: {
    accessKeyId: 'AKIAS2VS4QJVRXLKSVXV',
    secretAccessKey: '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',
  },
});

interface ProfileManagementProps {
  fetchProfile: () => Promise<any>;
  updateProfile: (profile: any) => Promise<void>;
  profileFields: Array<{label: string, name: string, type: string, editable: boolean}>;
  greeting?: (profile: any) => string;
  hasProfilePicture?: boolean;
}

const ProfileManagement: React.FC<ProfileManagementProps> = ({
  fetchProfile,
  updateProfile,
  profileFields,
  greeting,
  hasProfilePicture = false
}) => {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await fetchProfile();
      setProfile(data);
      setEditedProfile(data);
      setProfilePic(data?.profilePic);
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

  const uploadFileToS3 = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: 'gudfood-photos',
        Key: fileName,
        Body: file,
      },
    });

    try {
      setIsUploading(true);
      const result = await upload.done();
      const url = `https://${result.Bucket}.s3.amazonaws.com/${result.Key}`;
      return url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadFileToS3(file);
        setProfilePic(url);
        // Update the profile with the new profile picture URL
        const updatedProfile = { ...editedProfile, profilePic: url };
        setEditedProfile(updatedProfile);
        await updateProfile(updatedProfile);
        setSuccessMessage('Profile picture updated successfully!');
      } catch (error) {
        setAlertMessage('Failed to upload profile picture. Please try again.');
      }
    }
  };

  const handleRemoveProfilePic = async () => {
    try {
      // Update the profile with null profile picture
      const updatedProfile = { ...editedProfile, profilePic: null };
      setEditedProfile(updatedProfile);
      await updateProfile(updatedProfile);
      setProfilePic(null);
      setSuccessMessage('Profile picture removed successfully!');
    } catch (error) {
      setAlertMessage('Failed to remove profile picture. Please try again.');
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto mt-10">
      {greeting && <h1 className="text-2xl font-bold mb-4">{greeting(profile)}</h1>}
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Picture */}
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
              disabled={isUploading}
            />
            {profilePic && (
              <Button onClick={handleRemoveProfilePic} className="mt-2" variant="destructive">
                Remove Picture
              </Button>
            )}
            {isUploading && <p className="mt-2">Uploading...</p>}
          </div>
        )}
        
        {/* Profile Alerts */}
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

          {/* Profile Form */}
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
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;