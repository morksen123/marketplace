import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { AlertCircle } from 'lucide-react';

interface DistributorProfile {
  companyName: string;
  companyAddress: string;
  businessRegistrationNumber: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryPhoneNumber: string;
}

const ProfileManagement: React.FC = () => {
  const [profile, setProfile] = useState<DistributorProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<DistributorProfile | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showInfoAlert, setShowInfoAlert] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/distributor/profile');
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data: DistributorProfile = await response.json();
        setProfile(data);
        setEditedProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        const mockData: DistributorProfile = {
          companyName: 'GudFood Distributor Co.',
          companyAddress: '123 Food St, Singapore 123456',
          businessRegistrationNumber: 'UEN20240000A',
          primaryContactName: 'John Doe',
          primaryContactEmail: 'john@gudfood.com',
          primaryPhoneNumber: '+65 9123 4567',
        };
        setProfile(mockData);
        setEditedProfile(mockData);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setProfile(editedProfile);
    setIsEditing(false);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleDisabledFieldClick = () => {
    setShowInfoAlert(true);
    setTimeout(() => setShowInfoAlert(false), 5000); // Hide alert after 5 seconds
  };

  const DisabledFieldWithHoverCard = ({ label, value }: { label: string; value: string }) => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div 
          onClick={handleDisabledFieldClick}
          className="cursor-not-allowed"
        >
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <Input
            type="text"
            value={value}
            disabled
            className="mt-1 bg-gray-100 pointer-events-none"
          />
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        To edit this field, please contact our help team at <a href="mailto:help@gudfood.com">help@gudfood.com</a>.
      </HoverCardContent>
    </HoverCard>
  );

  if (!profile) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Distributor Profile</h1>
      
      {successMessage && (
        <Alert className="mb-4">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {showInfoAlert && (
        <Alert variant="info" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Some fields (Company Name, Company Address, and Business Registration Number) are restricted. 
            To update this information, please contact our help team at{' '}
            <a href="mailto:help@gudfood.com" className="font-medium underline hover:text-blue-600">
              help@gudfood.com
            </a>.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-8">
        {/* Column 1: Company Details */}
        <div className="space-y-4">
          <DisabledFieldWithHoverCard label="Company Name" value={profile.companyName} />
          <DisabledFieldWithHoverCard label="Company Address" value={profile.companyAddress} />
          <DisabledFieldWithHoverCard label="Business Registration Number" value={profile.businessRegistrationNumber} />
        </div>

        {/* Column 2: Contact Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Primary Contact Name</label>
            <Input
              type="text"
              name="primaryContactName"
              value={isEditing ? editedProfile?.primaryContactName : profile.primaryContactName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 ${!isEditing ? 'bg-gray-100' : ''}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Primary Contact Email</label>
            <Input
              type="email"
              name="primaryContactEmail"
              value={isEditing ? editedProfile?.primaryContactEmail : profile.primaryContactEmail}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 ${!isEditing ? 'bg-gray-100' : ''}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Primary Phone Number</label>
            <Input
              type="tel"
              name="primaryPhoneNumber"
              value={isEditing ? editedProfile?.primaryPhoneNumber : profile.primaryPhoneNumber}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 ${!isEditing ? 'bg-gray-100' : ''}`}
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            {isEditing ? (
              <>
                <Button onClick={handleSave} variant="secondary">Save</Button>
                <Button onClick={handleCancel} variant="outline">Cancel</Button>
              </>
            ) : (
              <Button onClick={handleEdit} variant="secondary">Edit Profile</Button>
            )}
          </div>
        </div>
      </div>

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
  );
};

export default ProfileManagement;