import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBuyerProfile } from '@/features/BuyerAccount/hooks/useBuyerProfile';
import { SaveAddressPrompt } from './SaveAddressPrompt';

type SavedAddressDropdownProps = {
  mode: 'shipping' | 'billing';
  onAddressChange: (addressId: string) => void;
};

export const SavedAddressDropdown: React.FC<SavedAddressDropdownProps> = ({
  mode,
  onAddressChange,
}) => {
  const { buyerProfile, defaultBillingAddress, defaultShippingAddress } =
    useBuyerProfile();

  const defaultAddress =
    mode === 'shipping' ? defaultShippingAddress : defaultBillingAddress;

  const hasAddresses =
    buyerProfile?.shippingAddresses &&
    buyerProfile.shippingAddresses.length > 0;

  return (
    <>
      <label className="text-[14.88px] text-[#30313D] mb-1">
        Saved addresses
      </label>
      <Select
        onValueChange={onAddressChange}
        defaultValue={defaultAddress?.shippingAddressId?.toString() || ''}
      >
        <SelectTrigger className="w-full mb-3 p-3">
          <SelectValue placeholder="Choose an address" />
        </SelectTrigger>
        <SelectContent>
          {!hasAddresses && <SaveAddressPrompt />}
          {buyerProfile?.shippingAddresses?.map((address) => (
            <SelectItem
              key={address.shippingAddressId}
              value={address.shippingAddressId?.toString() || ''}
            >
              {address.addressLine1}, #{address.addressLine2},{' '}
              {address.postalCode}, {address.phoneNumber}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
