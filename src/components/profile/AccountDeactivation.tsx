import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@/features/Authentication/hooks/useAuthActions";

interface AccountDeactivationProps {
  userType: 'Buyer' | 'Distributor';
  onDeactivate: (password: string) => void;
}

const AccountDeactivation: React.FC<AccountDeactivationProps> = ({ userType, onDeactivate }) => {
  const [confirmDeactivation, setConfirmDeactivation] = useState(false);
  const [password, setPassword] = useState("");
  const { logout } = useAuthActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmDeactivation) {
      await onDeactivate(password);
      logout();
    } else {
      alert(`Please confirm that you want to deactivate your ${userType} account.`);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-red-600">
          Deactivate {userType} Account
        </h1>

        <p className="mb-6 text-center text-gray-600">
          Deactivating your {userType.toLowerCase()} account will disable your profile and remove your
          access to the platform. You can reactivate your account at any time by
          logging back in.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Re-enter your password to confirm deactivation
            </label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="flex items-center">
            <Checkbox
              checked={confirmDeactivation}
              onCheckedChange={(checked) => setConfirmDeactivation(checked as boolean)}
              className="border-gray-300"
            />
            <label className="text-sm text-gray-700">
              I understand the consequences, deactivate my account.
            </label>
          </div>

          <Button
            type="submit"
            variant="destructive"
            className="w-full mt-4"
            disabled={!confirmDeactivation || !password}
          >
            Deactivate Account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AccountDeactivation;
