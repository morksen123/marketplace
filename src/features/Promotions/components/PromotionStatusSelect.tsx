import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Promotion } from '../constants';

interface PromotionStatusSelectProps {
  value: Promotion['status'];
  onChange: (value: Promotion['status']) => void;
}

export const PromotionStatusSelect: React.FC<PromotionStatusSelectProps> = ({ value, onChange }) => {
  const statusOptions: { value: Promotion['status']; label: string; color: string }[] = [
    { value: 'ACTIVE', label: 'Active', color: 'bg-green-500' },
    { value: 'PAUSED', label: 'Paused', color: 'bg-yellow-500' }
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue>
          {value && (
            <Badge className={statusOptions.find(option => option.value === value)?.color}>
              {statusOptions.find(option => option.value === value)?.label}
            </Badge>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <Badge className={option.color}>{option.label}</Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};