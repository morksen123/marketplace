'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Book, CreditCard, Home, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Address, useAddress } from '../hooks/useAddress';
import { initialFormState, sortAddresses } from '../lib/address';

export default function AddressBook() {
  const [formData, setFormData] = useState<Address>(initialFormState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { existingAddresses, addAddress, updateAddress, removeAddress } =
    useAddress();

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate all fields at once
    if (!formData.label) newErrors.label = 'Label is required';
    if (!formData.addressLine1) newErrors.addressLine1 = 'Address Line 1 is required';
    if (!formData.addressLine2) newErrors.addressLine2 = 'Unit Number is required';
    if (!formData.postalCode) newErrors.postalCode = 'Postal Code is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';

    // Move regex validations here to check only when submitting
    const phoneRegex = /^\d{8,}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be at least 8 digits';
    }

    const postalCodeRegex = /^\d{6}$/;
    if (formData.postalCode && !postalCodeRegex.test(formData.postalCode)) {
      newErrors.postalCode = 'Postal Code must be exactly 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (formData.shippingAddressId) {
      await updateAddress(formData);
    } else {
      await addAddress(formData);
    }

    setFormData(initialFormState);
  };

  const handleEdit = (address: Address) => {
    setFormData(address);
  };

  const handleDelete = async (id?: number) => {
    if (!id) {
      return;
    }
    await removeAddress(id);
  };

  const handleCancel = () => {
    setFormData(initialFormState);
  };

  return (
    <div className="container mx-auto p-4 text-left">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <Book className="mr-2 h-6 w-6" />
        Address Book
      </h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {formData.shippingAddressId ? 'Edit Address' : 'Add New Address'}
            </CardTitle>
            <CardDescription>
              {formData.shippingAddressId
                ? 'Update your address details'
                : 'Enter your address details'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="label">Address Label</Label>
                <Input
                  id="label"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  placeholder="E.g., Home, Office, Parents' House"
                  className={errors.label ? 'border-red-500' : ''}
                />
                {errors.label && (
                  <p className="text-red-500 text-sm">{errors.label}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="E.g., 8123 4567"
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  placeholder="E.g., Blk 123 Clementi Avenue 1"
                  className={errors.addressLine1 ? 'border-red-500' : ''}
                />
                {errors.addressLine1 && (
                  <p className="text-red-500 text-sm">{errors.addressLine1}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine2">Unit Number</Label>
                <Input
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  placeholder="E.g., #12-34"
                  className={errors.addressLine2 ? 'border-red-500' : ''}
                />
                {errors.addressLine2 && (
                  <p className="text-red-500 text-sm">{errors.addressLine2}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="E.g., 123456"
                  className={errors.postalCode ? 'border-red-500' : ''}
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm">{errors.postalCode}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isDefaultShippingAddress"
                  name="isDefaultShippingAddress"
                  checked={formData.isDefaultShippingAddress}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      isDefaultShippingAddress: checked,
                    }))
                  }
                />
                <Label htmlFor="isDefaultShippingAddress">
                  Set as default shipping address
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isDefaultBillingAddress"
                  name="isDefaultBillingAddress"
                  checked={formData.isDefaultBillingAddress}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      isDefaultBillingAddress: checked,
                    }))
                  }
                />
                <Label htmlFor="isDefaultBillingAddress">
                  Set as default billing address
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" type="submit">
                {formData.shippingAddressId ? 'Update Address' : 'Add Address'}
              </Button>
              {formData.shippingAddressId && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleCancel}
                  className="ml-2"
                >
                  Cancel
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your Addresses</CardTitle>
            <CardDescription>Manage your saved addresses</CardDescription>
          </CardHeader>
          <CardContent>
            {existingAddresses.length === 0 ? (
              <p className="text-muted-foreground">No addresses saved yet.</p>
            ) : (
              <ul className="space-y-4">
                {sortAddresses(existingAddresses).map((address) => (
                  <li
                    key={address.shippingAddressId}
                    className={`border-b p-4  ${
                      address.isDefaultShippingAddress ||
                      address.isDefaultBillingAddress
                        ? 'bg-gray-50 p-2 rounded-lg'
                        : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <p className="font-bold text-lg">{address.label}</p>
                        <p>
                          <span className="font-medium">Phone:</span>{' '}
                          {address.phoneNumber}
                        </p>
                        <p>
                          <span className="font-medium">Address:</span>{' '}
                          {address.addressLine1}
                        </p>
                        <p>
                          <span className="font-medium">Unit:</span>{' '}
                          {address.addressLine2}
                        </p>
                        <p>
                          <span className="font-medium">Postal Code:</span>{' '}
                          {address.postalCode}
                        </p>
                        <div className="mt-2 space-x-2">
                          {address.isDefaultShippingAddress && (
                            <Badge variant="shipping">
                              <Home className="h-4 w-4 mr-1" />
                              Default Shipping
                            </Badge>
                          )}
                          {address.isDefaultBillingAddress && (
                            <Badge variant="billing">
                              <CreditCard className="h-4 w-4 mr-1" />
                              Default Billing
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(address)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleDelete(address.shippingAddressId)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
