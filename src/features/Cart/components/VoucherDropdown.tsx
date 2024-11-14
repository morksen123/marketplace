import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tag } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Voucher {
  voucherId: number;
  voucherCode: string;
  voucherValue: number;
  expiresAt: string;
  used: boolean;
}

interface VoucherDropdownProps {
  onVoucherSelect: (voucher: Voucher | null) => void;
  selectedVoucher?: Voucher | null;
  onApply: (voucherCode: string) => void;
}

export const VoucherDropdown: React.FC<VoucherDropdownProps> = ({
  onVoucherSelect = () => {},
  selectedVoucher,
  onApply,
}) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch('/api/buyer/vouchers', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch vouchers');
        }
        const data = await response.json();
        setVouchers(data);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      }
    };

    fetchVouchers();
  }, []);

  const formatExpiryDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleVoucherChange = (value: string) => {
    if (selectedVoucher) {
      onApply('');
    }

    if (value === 'no-voucher') {
      onVoucherSelect(null);
      return;
    }

    const voucher = vouchers.find(v => v.voucherId.toString() === value);
    if (voucher) {
      onVoucherSelect(voucher);
      onApply(voucher.voucherCode);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[14.88px] text-[#30313D] mb-1">
        Available Vouchers
      </label>
      <Select
        onValueChange={handleVoucherChange}
        value={selectedVoucher?.voucherId?.toString() || 'no-voucher'}
      >
        <SelectTrigger className="w-full mb-3 p-3">
          {selectedVoucher ? (
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2 text-secondary" />
              <span>${selectedVoucher.voucherValue} Voucher</span>
              <span className="ml-2 text-sm text-muted-foreground">
                Expires: {formatExpiryDate(selectedVoucher.expiresAt)}
              </span>
            </div>
          ) : (
            <span>Select a voucher</span>
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="no-voucher">No voucher</SelectItem>
          {vouchers.map((voucher) => (
            <SelectItem
              key={voucher.voucherId}
              value={voucher.voucherId.toString()}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-secondary" />
                  <span>${voucher.voucherValue} Voucher</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Expires: {formatExpiryDate(voucher.expiresAt)}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
