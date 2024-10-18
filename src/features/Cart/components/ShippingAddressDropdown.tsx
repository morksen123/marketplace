import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBuyerProfile } from '@/features/BuyerAccount/hooks/useBuyerProfile';
import { useState } from 'react';

export const ShippingAddressDropdown = () => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const { buyerProfile, defaultBillingAddress, defaultShippingAddress } =
    useBuyerProfile();

  const buyerShippingAddresses = buyerProfile?.shippingAddresses;

  return (
    <Select
      onValueChange={(value) => setSelectedAddress(value)}
      defaultValue={defaultAddress?.shippingAddressId?.toString() || ''}
    >
      <SelectTrigger className="w-full mb-4">
        <SelectValue placeholder="Choose a shipping address" />
      </SelectTrigger>
      <SelectContent>
        {buyerShippingAddresses?.map((address) => (
          <SelectItem
            key={address.shippingAddressId}
            value={address.shippingAddressId?.toString() || ''}
          >
            {address.addressLine1}, {address.postalCode}
          </SelectItem>
        ))}
        <SelectItem value="new">Add new address</SelectItem>
      </SelectContent>
    </Select>
  );
};
