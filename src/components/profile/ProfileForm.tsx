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
  onEdit: () => void;
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

  const handleAddressChange = (index: number, field: string, value: string) => {
    const updatedAddresses = [...editedProfile.shippingAddresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [field]: value
    };
    onChange({
      ...editedProfile,
      shippingAddresses: updatedAddresses,
    });
  };

  const addNewAddress = () => {
    onChange({
      ...editedProfile,
      shippingAddresses: [
        ...editedProfile.shippingAddresses,
        { recipientName: '', phoneNumber: '', addressLine1: '', addressLine2: '', postalCode: '' }
      ],
    });
  };

  const removeAddress = (index: number) => {
    const updatedAddresses = editedProfile.shippingAddresses.filter((_: any, i: number) => i !== index);
    onChange({
      ...editedProfile,
      shippingAddresses: updatedAddresses,
    });
  };

  const renderField = ({ label, name, type, editable }: {label: string, name: string, type: string, editable: boolean}) => {
    if (name === 'shippingAddresses') {
      return (
        <div key={name}>
          <Label className="block text-sm font-medium text-gray-700 mb-2">{label}</Label>
          {editedProfile.shippingAddresses && editedProfile.shippingAddresses.length > 0 ? (
            editedProfile.shippingAddresses.map((address: any, index: number) => (
              <div key={index} className="mb-4 p-4 border rounded">
                <Input
                  type="text"
                  value={address.recipientName}
                  onChange={(e) => handleAddressChange(index, 'recipientName', e.target.value)}
                  placeholder="Recipient Name"
                  className="mb-2"
                  disabled={!isEditing}
                />
                <Input
                  type="text"
                  value={address.phoneNumber}
                  onChange={(e) => handleAddressChange(index, 'phoneNumber', e.target.value)}
                  placeholder="Phone Number"
                  className="mb-2"
                  disabled={!isEditing}
                />
                <Input
                  type="text"
                  value={address.addressLine1}
                  onChange={(e) => handleAddressChange(index, 'addressLine1', e.target.value)}
                  placeholder="Address Line 1"
                  className="mb-2"
                  disabled={!isEditing}
                />
                <Input
                  type="text"
                  value={address.addressLine2}
                  onChange={(e) => handleAddressChange(index, 'addressLine2', e.target.value)}
                  placeholder="Address Line 2"
                  className="mb-2"
                  disabled={!isEditing}
                />
                <Input
                  type="text"
                  value={address.postalCode}
                  onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)}
                  placeholder="Postal Code"
                  className="mb-2"
                  disabled={!isEditing}
                />
                {isEditing && (
                  <Button type="button" onClick={() => removeAddress(index)} variant="destructive" size="sm">
                    Remove Address
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic mb-4">
              No shipping addresses added yet.
            </div>
          )}
          {isEditing && (
            <Button type="button" onClick={addNewAddress} variant="outline" size="sm" className="mt-2">
              Add New Address
            </Button>
          )}
        </div>
      );
    }

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
          <Button type="button" onClick={onEdit} variant="secondary">Edit Profile</Button>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;