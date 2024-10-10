import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const ShippingAddressesPage = () => {
  const API_BASE_URL = 'http://localhost:8080/api';
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/buyer/profile');
      if (!response.ok) throw new Error('Failed to fetch addresses');
      const data = await response.json();
      console.log(data.shippingAddresses);
      setAddresses(data.shippingAddresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      //   toast.error('Failed to fetch addresses');
    }
  };

  const handleAddAddress = async (newAddress) => {
    try {
      const response = await fetch('/api/buyer/profile/shipping-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress),
      });
      if (!response.ok) throw new Error('Failed to add address');
      const addedAddress = await response.json();
      setAddresses([...addresses, addedAddress]);
      setIsAddDialogOpen(false);
      //   toast.success('Address added successfully');
    } catch (error) {
      console.error('Error adding address:', error);
      //   toast.error('Failed to add address');
    }
  };

  const handleEditAddress = async (updatedAddress) => {
    try {
      const response = await fetch('/api/buyer/profile/shipping-address', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAddress),
      });
      if (!response.ok) throw new Error('Failed to update address');
      const editedAddress = await response.json();
      setAddresses(
        addresses.map((addr) =>
          addr.id === updatedAddress.id ? editedAddress : addr,
        ),
      );
      setEditingAddress(null);
      console.log('Address updated successfully');
      //   toast.success('Address updated successfully');
    } catch (error) {
      console.error('Error updating address:', error);
      //   toast.error('Failed to update address');
    }
  };

  const handleRemoveAddress = async (id) => {
    try {
      const response = await fetch(
        `/api/buyer/shipping-address?shippingAddressId=${id}`,
        {
          method: 'DELETE',
        },
      );
      if (!response.ok) throw new Error('Failed to remove address');
      setAddresses(addresses.filter((addr) => addr.shippingAddressId !== id));
      console.log('Address removed successfully');
      //   toast.success('Address removed successfully');
    } catch (error) {
      console.error('Error removing address:', error);
      //   toast.error('Failed to remove address');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shipping Addresses</h1>
      <section className="wrapper mt-10">
        {addresses.length === 0 ? (
          <p className="text-center text-gray-500">
            You haven't added any shipping addresses yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.map((address) => (
              <Card key={address.shippingAddressId} className="shadow-md">
                <CardHeader>
                  <CardTitle>{address.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{`${address.addressLine1}, ${address.addressLine2} ${address.postalCode}`}</p>
                  <p>{address.phoneNumber}</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingAddress(address)}
                    >
                      <Pencil className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleRemoveAddress(address.shippingAddressId)
                      }
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="mt-4">
            <PlusCircle className="w-6 h-6 mr-2" /> Add New Address
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <AddressForm onSubmit={handleAddAddress} />
        </DialogContent>
      </Dialog>
      {editingAddress && (
        <Dialog
          open={!!editingAddress}
          onOpenChange={() => setEditingAddress(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Address</DialogTitle>
            </DialogHeader>
            <AddressForm
              address={editingAddress}
              onSubmit={handleEditAddress}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

const AddressForm = ({ address, onSubmit }) => {
  const [formData, setFormData] = useState(
    address || {
      label: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      postalCode: '',
    },
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="label"
        value={formData.label}
        onChange={handleChange}
        placeholder="Address Name (e.g., Home, Work)"
        required
      />
      <Input
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="Phone Number"
        required
      />
      <Input
        name="addressLine1"
        value={formData.addressLine1}
        onChange={handleChange}
        placeholder="Address Line 1"
        required
      />
      <Input
        name="addressLine2"
        value={formData.addressLine2}
        onChange={handleChange}
        placeholder="Address Line 2"
      />
      <Input
        name="postalCode"
        value={formData.postalCode}
        onChange={handleChange}
        placeholder="Postal Code"
        required
      />
      <Button variant="secondary" type="submit">
        {address ? 'Update Address' : 'Add Address'}
      </Button>
    </form>
  );
};

export default ShippingAddressesPage;
