import { del, get, post, put } from '@/lib/api-client';
import { Address } from '../hooks/useAddress';

export async function fetchAddresses(): Promise<Address[]> {
  const { data } = await get<{ shippingAddresses: Address[] }>(
    '/buyer/profile',
  );
  return data?.shippingAddresses || [];
}

export async function addAddress(newAddress: Omit<Address, 'id'>) {
  const { data } = await post<Address>(
    '/buyer/profile/shipping-address',
    newAddress,
  );
  return data;
}

export async function updateAddress(
  updatedAddress: Address,
): Promise<Address | null> {
  const { data } = await put<Address>(
    '/buyer/profile/shipping-address',
    updatedAddress,
  );
  return data;
}

export async function removeAddress(id: number): Promise<void> {
  await del(`/buyer/shipping-address?shippingAddressId=${id}`);
}

export async function editAddress(updatedAddress: Address) {
  await post('/buyer/profile/shipping-address', JSON.stringify(updatedAddress));
}

export async function setDefaultAddress(
  addressId: number,
  type: 'shipping' | 'billing',
) {
  const { data } = await put<Address>(
    `/buyer/profile/${type}-address/set-default`,
    { addressId },
  );
  return data;
}
