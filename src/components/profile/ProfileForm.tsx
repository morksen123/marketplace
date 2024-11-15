import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface ProfileFormProps {
  profile: any;
  editedProfile: any;
  isEditing: boolean;
  profileFields: Array<{label: string, name: string, type: string, editable: boolean}>;
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (newProfile: any) => void;
  onNonEditableFieldClick: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  editedProfile,
  isEditing,
  profileFields,
  onEdit,
  onSave,
  onCancel,
  onChange,
  onNonEditableFieldClick,
}) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...editedProfile,
      [e.target.name]: e.target.value,
    });
  };

  const renderField = ({ label, name, type, editable }: {label: string, name: string, type: string, editable: boolean}) => {

    const value = isEditing ? editedProfile[name] : profile[name];
    const inputField = (
      <Input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        disabled={!isEditing || !editable}
        className={`mt-1 block w-full ${(!isEditing || !editable) ? 'bg-gray-100 pointer-events-none' : ''}`}
        onClick={!editable ? onNonEditableFieldClick : undefined}
      />
    );

    return (
      <div key={name}>
        <Label className="block text-sm font-medium text-gray-700">
          {label}
        </Label>
        {editable ? (
          inputField
        ) : (
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="cursor-not-allowed" onClick={onNonEditableFieldClick}>
                {inputField}
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              To edit this field, please contact our help team at <a href="mailto:help@gudfood.com">help@gudfood.com</a>.
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
    );
  };

  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
      {profileFields.map(renderField)}
      <div className="flex justify-start space-x-2 mt-4">
        {isEditing ? (
          <>
            <Button type="submit" variant="secondary">Save</Button>
            <Button type="button" onClick={onCancel} variant="outline">Cancel</Button>
          </>
        ) : (
          <Button type="button" className="button-green" onClick={onEdit} variant="secondary">Edit Profile</Button>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;