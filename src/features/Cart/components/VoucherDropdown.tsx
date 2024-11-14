import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tag, Ticket, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Voucher {
  voucherId: number;
  voucherCode: string;
  voucherValue: number;
  expiresAt: string;
  used: boolean;
  minimumSpend?: number;
}

interface VoucherDropdownProps {
  onVoucherSelect: (voucher: Voucher | null) => void;
  selectedVoucher?: Voucher | null;
  onApply: (voucherCode: string) => void;
  calculatedTotal: number;
}

export const VoucherDropdown: React.FC<VoucherDropdownProps> = ({
  onVoucherSelect = () => {},
  selectedVoucher,
  onApply,
  calculatedTotal,
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

  const getDaysUntilExpiry = (dateString: string) => {
    const today = new Date();
    const expiryDate = new Date(dateString);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

  const isVoucherDisabled = (voucher: Voucher) => {
    if (!voucher.voucherValue) return false;
    console.log(calculatedTotal);
    return calculatedTotal < voucher.voucherValue;
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Ticket className="h-4 w-4 text-secondary" />
        Available Vouchers
      </label>
      <Select
        onValueChange={handleVoucherChange}
        value={selectedVoucher?.voucherId?.toString() || 'no-voucher'}
      >
        <SelectTrigger className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-secondary/50 transition-colors min-h-[72px]">
          <AnimatePresence mode="wait">
            {selectedVoucher ? (
              <motion.div
                className="flex flex-col w-full"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-secondary" />
                  <span>
                    <strong>${selectedVoucher.voucherValue}</strong> Voucher
                  </span>
                </div>
                <span className="text-sm text-muted-foreground italic">
                  Expires: {formatExpiryDate(selectedVoucher.expiresAt)}
                </span>
              </motion.div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-secondary" />
                  <span>Select a voucher</span>
                </div>
              </div>
            )}
          </AnimatePresence>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="no-voucher">No voucher</SelectItem>
          {vouchers.map((voucher) => (
            <SelectItem
              key={voucher.voucherId}
              value={voucher.voucherId.toString()}
              disabled={isVoucherDisabled(voucher)}
              className={isVoucherDisabled(voucher) ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <div className="flex flex-col w-full">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-secondary" />
                  <span>
                    <strong>${voucher.voucherValue}</strong> Voucher
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground italic">
                    Expires: {formatExpiryDate(voucher.expiresAt)}
                  </span>
                  {voucher.minimumSpend && (
                    <span className="text-xs text-gray-500">
                      Min. spend: ${voucher.minimumSpend}
                    </span>
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
