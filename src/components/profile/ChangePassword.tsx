import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ChangePasswordProps {
  onSubmit: (currentPassword: string, newPassword: string) => void;
  title?: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  onSubmit,
  title = 'Change Password',
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword === confirmNewPassword) {
      onSubmit(currentPassword, newPassword);
    } else {
      setPasswordMismatch(true);
      console.log('New passwords do not match');
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <Input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>

          {passwordMismatch && (
            <Alert variant="destructive">
              <AlertDescription>
                New passwords do not match. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" variant="secondary" className="w-full mt-4">
            Change Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
