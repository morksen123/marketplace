import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';

export interface AddressFormState {
  firstName: string;
  lastName: string;
  address: string;
  zipCode: string;
  country: string;
}

interface AddressFormProps {
  title: string;
  state: AddressFormState;
  onChange: (field: keyof AddressFormState, value: string) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  title,
  state,
  onChange,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-left">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={state.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              placeholder="John"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={state.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
              placeholder="Doe"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={state.address}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="123 Main St"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              value={state.zipCode}
              onChange={(e) => onChange('zipCode', e.target.value)}
              placeholder="12345"
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Select
              value={state.country}
              onValueChange={(value) => onChange('country', value)}
            >
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sg">Singapore</SelectItem>
                {/* Add more countries as needed */}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
