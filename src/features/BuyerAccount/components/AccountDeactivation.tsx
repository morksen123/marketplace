import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const AccountDeactivation: React.FC = () => {
  const [confirmDeactivation, setConfirmDeactivation] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmDeactivation) {
      // Logic to handle account deactivation
      console.log("Account deactivated");
    } else {
      alert("Please confirm that you want to deactivate your account.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-red-600">
          Deactivate Account
        </h1>

        <p className="mb-6 text-center text-gray-600">
          Deactivating your account will disable your profile and remove your
          access to the platform. You can reactivate your account at any time by
          logging back in.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm your password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full"
              required
            />
          </div>

          <div className="flex items-center mt-4">
            <Checkbox
              checked={confirmDeactivation}
              onCheckedChange={(checked) => setConfirmDeactivation(checked as boolean)}
              className="mr-2"
            />
            <label className="text-sm text-gray-700">
              I understand the consequences, deactivate my account.
            </label>
          </div>

          <Button
            type="submit"
            variant="destructive"
            className="w-full mt-6"
            disabled={!confirmDeactivation}
          >
            Deactivate Account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AccountDeactivation;
