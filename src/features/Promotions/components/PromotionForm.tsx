import React, { useState, useEffect } from 'react';
import { Promotion } from '../constants';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PromotionStatusSelect } from './PromotionStatusSelect';

interface PromotionFormProps {
  formData: Partial<Promotion> | null;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleStatusChange: (newStatus: Promotion['status']) => void;
}

export const PromotionForm: React.FC<PromotionFormProps> = ({
  formData,
  handleChange,
  handleStatusChange,
}) => {
  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [minEndDate, setMinEndDate] = useState<string>(getTodayDate());

  useEffect(() => {
    // Update minEndDate when startDate changes
    if (formData && formData.startDate) {
      setMinEndDate(formData.startDate);
    }
  }, [formData?.startDate]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    setMinEndDate(e.target.value);
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="promotionName">Promotion Name</Label>
        <Input
          id="promotionName"
          name="promotionName"
          value={formData ? formData.promotionName : ''} // Added null check
          onChange={handleChange}
          placeholder="Enter promotion name"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData ? formData.description : ''}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Enter promotion description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="discountPercentage">Discount Percentage (%)</Label>
        <Input
          id="discountPercentage"
          name="discountPercentage"
          type="number"
          value={formData ? formData.discountPercentage : ''}
          onChange={handleChange}
          min="0"
          max="99"
          required
          placeholder="Enter discount percentage"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          value={formData ? formData.startDate : ''}
          onChange={handleStartDateChange}
          min={formData && formData.startDate ? formData.startDate : getTodayDate()}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          name="endDate"
          type="date"
          value={formData ? formData.endDate : ''}
          onChange={handleChange}
          min={minEndDate}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        {/* <PromotionStatusSelect
          value={formData.status}
          onChange={handleStatusChange}
        /> */}
      </div>
    </>
  );
};
