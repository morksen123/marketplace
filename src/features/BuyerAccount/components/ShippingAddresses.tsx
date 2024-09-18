import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { shippingAddressDefaultValues } from '../constants';

const ShippingAddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    // const response = await fetch('/api/addresses');
    // const data = await response.json();
    // setAddresses(data);
    setAddresses(shippingAddressDefaultValues as []);
  };

  const handleAddAddress = (newAddress) => {
    setAddresses([...addresses, { id: Date.now(), ...newAddress }]);
    setIsAddDialogOpen(false);
  };

  const handleEditAddress = (updatedAddress) => {
    setAddresses(addresses.map(addr => addr.id === updatedAddress.id ? updatedAddress : addr));
    setEditingAddress(null);
  };

  const handleRemoveAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shipping Addresses</h1>
      <section className="wrapper mt-10">
      {addresses.length === 0 ? (
        <p className="text-center text-gray-500">You haven't added any shipping addresses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className="shadow-md">
              <CardHeader>
                <CardTitle>{address.recipientName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{`${address.addressLine1}, ${address.addressLine2} ${address.postalCode}`}</p>
                <p>{address.phoneNumber}</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingAddress(address)}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveAddress(address.id)}>
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
        <Dialog open={!!editingAddress} onOpenChange={() => setEditingAddress(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Address</DialogTitle>
            </DialogHeader>
            <AddressForm address={editingAddress} onSubmit={handleEditAddress} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

const AddressForm = ({ address, onSubmit }) => {
  const [formData, setFormData] = useState(address || { recipientName: '', phoneNumber: '', addressLine1: '', addressLine2: '', postalCode: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="recipientName" value={formData.recipientName} onChange={handleChange} placeholder="Address Name (e.g., Home, Work)" required />
      <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
      <Input name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Address Line 1" required />
      <Input name="addressLine2" value={formData.addressLine2} onChange={handleChange} placeholder="Address Line 2"/>
      <Input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code" required />
      <Button variant="secondary" type="submit">{address ? 'Update Address' : 'Add Address'}</Button>
    </form>
  );
};

export default ShippingAddressesPage;