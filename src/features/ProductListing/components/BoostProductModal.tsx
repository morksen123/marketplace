import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ElectricBolt from '@mui/icons-material/ElectricBolt';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface BoostProductModalProps {
  boostStatus: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (startDate: string) => void;
  productName: string;
}

const BoostProductModal: React.FC<BoostProductModalProps> = ({
  boostStatus,
  isOpen,
  onClose,
  onSubmit,
  productName,
}) => {
  const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(startDate);
    onClose();
  };

  if (!isOpen) return null;

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading 0 if necessary
    const day = String(today.getDate()).padStart(2, '0'); // Add leading 0 if necessary
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Boost Product: {productName}</h2>
        <form onSubmit={handleSubmit}>
          {(boostStatus === 'NONE' ||
            boostStatus === 'COMPLETE' ||
            boostStatus === 'NOT_STARTED' ||
            boostStatus === null) && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="start-date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {boostStatus === 'NOT_STARTED' ? 'Change Start Date' : 'Start Date'}
                </label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={getTodayDate()}
                  required
                  className="w-full"
                />
              </div>
              {/* <div className="mb-6">
                <label
                  htmlFor="end-date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date
                </label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || getTodayDate()}
                  required
                  className="w-full"
                />
              </div> */}
            </>
          )}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="secondary">
              {boostStatus === 'PAUSED' ? (
                <>
                  <PlayArrowIcon className="mr-2" />
                  Resume Boost
                </>
              ) : (
                <>
                  <ElectricBolt className="mr-2" />
                  {boostStatus === 'COMPLETE' ? 'Boost Again' : 'Boost Product'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoostProductModal;
