'use client';

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

export default function AddressBook() {
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { existingAddresses, addAddress, updateAddress, removeAddress } =
    useAddress();

  const validateForm = (formData: FormData): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.get('label')) newErrors.label = 'Label is required';
    if (!formData.get('phoneNumber'))
      newErrors.phoneNumber = 'Phone number is required';
    if (!formData.get('addressLine1'))
      newErrors.addressLine1 = 'Address Line 1 is required';
    if (!formData.get('postalCode'))
      newErrors.postalCode = 'Postal Code is required';

    const postalCodeRegex = /^\d{6}$/;
    if (
      formData.get('postalCode') &&
      !postalCodeRegex.test(formData.get('postalCode') as string)
    ) {
      newErrors.postalCode = 'Postal Code must be exactly 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!validateForm(formData)) return;

    const newAddress: Address = {
      shippingAddressId: editingAddress ? editingAddress.shippingAddressId : 0, // refactor
      label: formData.get('label') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      addressLine1: formData.get('addressLine1') as string,
      addressLine2: formData.get('addressLine2') as string,
      postalCode: formData.get('postalCode') as string,
      isDefaultShippingAddress: formData.get('defaultShipping') === 'on',
      isDefaultBillingAddress: formData.get('defaultBilling') === 'on',
    };

    if (editingAddress) {
      await updateAddress(newAddress);
    } else {
      await addAddress(newAddress);
    }

    setEditingAddress(null);
    e.currentTarget.reset();
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
  };

  const handleDelete = async (id: number) => {
    await removeAddress(id);
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
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </CardTitle>
            <CardDescription>
              {editingAddress
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
                  defaultValue={editingAddress?.label}
                  required
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
                  defaultValue={editingAddress?.phoneNumber}
                  required
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
                  defaultValue={editingAddress?.addressLine1}
                  required
                />
                {errors.addressLine1 && (
                  <p className="text-red-500 text-sm">{errors.addressLine1}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  name="addressLine2"
                  defaultValue={editingAddress?.addressLine2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  defaultValue={editingAddress?.postalCode}
                  required
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm">{errors.postalCode}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="defaultShipping"
                  name="defaultShipping"
                  defaultChecked={editingAddress?.isDefaultShippingAddress}
                />
                <Label htmlFor="defaultShipping">
                  Set as default shipping address
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="defaultBilling"
                  name="defaultBilling"
                  defaultChecked={editingAddress?.isDefaultBillingAddress}
                />
                <Label htmlFor="defaultBilling">
                  Set as default billing address
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" type="submit">
                {editingAddress ? 'Update Address' : 'Add Address'}
              </Button>
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
                {existingAddresses.map((address) => (
                  <li
                    key={address.shippingAddressId}
                    className={`border-b pb-4 last:border-b-0 ${
                      address.isDefaultShippingAddress ||
                      address.isDefaultBillingAddress
                        ? 'bg-gray-50 p-2 rounded'
                        : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{address.label}</p>
                        <p>{address.phoneNumber}</p>
                        <p>{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>{address.postalCode}</p>
                        <div className="mt-2">
                          {address.isDefaultShippingAddress && (
                            <span className="inline-flex items-center text-sm text-green-600 mr-2">
                              <Home className="h-4 w-4 mr-1" />
                              Default Shipping
                            </span>
                          )}
                          {address.isDefaultBillingAddress && (
                            <span className="inline-flex items-center text-sm text-blue-600">
                              <CreditCard className="h-4 w-4 mr-1" />
                              Default Billing
                            </span>
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
