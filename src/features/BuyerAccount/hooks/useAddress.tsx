import { handleSuccessApi } from '@/lib/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addAddress,
  fetchAddresses,
  removeAddress,
  updateAddress,
} from '../lib/address';

export interface Address {
  shippingAddressId?: number;
  label: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  isDefaultShippingAddress: boolean;
  isDefaultBillingAddress: boolean;
  buyerName: string;
}

export function useAddress() {
  const queryClient = useQueryClient();

  const {
    data: addresses = [],
    isLoading,
    error,
  } = useQuery<Address[], Error>({
    queryKey: ['addresses'],
    queryFn: fetchAddresses,
  });

  const addAddressMutation = useMutation({
    mutationFn: (newAddress: Omit<Address, 'id'>) => addAddress(newAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      handleSuccessApi(
        'Address Added',
        'Your new address has been successfully added.',
      );
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: (updatedAddress: Address) => updateAddress(updatedAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      handleSuccessApi(
        'Address Updated',
        'Your address has been successfully updated.',
      );
    },
  });

  const removeAddressMutation = useMutation({
    mutationFn: (addressId: number) => removeAddress(addressId),
    onSuccess: (_, addressId: number) => {
      queryClient.setQueryData<Address[]>(['addresses'], (old = []) =>
        old.filter((address) => address.shippingAddressId !== addressId),
      );
      handleSuccessApi(
        'Address Removed',
        'The selected address has been successfully removed.',
      );
    },
  });

  const defaultShippingAddress = addresses.find(
    (address) => address.isDefaultShippingAddress,
  );
  const defaultBillingAddress = addresses.find(
    (address) => address.isDefaultBillingAddress,
  );

  return {
    existingAddresses: addresses,
    defaultShippingAddress,
    defaultBillingAddress,
    isLoading,
    error,
    addAddress: addAddressMutation.mutateAsync,
    updateAddress: updateAddressMutation.mutateAsync,
    removeAddress: removeAddressMutation.mutate,
  };
}
