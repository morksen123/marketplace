import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";

const ProductFilter = ({ onFilter, initialFilters }) => {
  const [filters, setFilters] = React.useState(initialFilters);
  const categoryOptions = ["CANNED_GOODS", "DAIRY_AND_EGGS", "DRY_GOODS_AND_STAPLES", "FRUITS_AND_VEGETABLES", "FROZEN"];
  const conditionOptions = ["BRUISED", "DAMAGED_PACKAGING", "NEAR_EXPIRY", "UGLY"];
  const deliveryMethodOptions = ["SELF_PICK_UP", "DOORSTEP_DELIVERY"];

  useEffect(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  };

  const handleCheckboxChange = (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: prevFilters[key].includes(value)
        ? prevFilters[key].filter(item => item !== value)
        : [...prevFilters[key], value]
    }));
  };

  const renderCheckboxGroup = (options, filterKey) => (
    <div className="space-y-2">
      {options.map((option) => (
        <div key={option} className="flex items-center">
          <Checkbox
            id={option}
            checked={filters[filterKey].includes(option)}
            onCheckedChange={() => handleCheckboxChange(filterKey, option)}
            className="h-5 w-5 border-2 border-gray-300 rounded-sm"
          />
          <label htmlFor={option} className="ml-2 text-sm">
            {option.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
          </label>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      <div className="space-y-4">
        <Label className="text-base font-medium">Categories</Label>
        {renderCheckboxGroup(categoryOptions, 'categories')}
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">Price Range</Label>
        <div className="flex space-x-4">
          <div className="flex-1">
            <Label htmlFor="minPrice" className="text-sm">Min</Label>
            <input
              id="minPrice"
              type="number"
              min={0}
              max={10000}
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="maxPrice" className="text-sm">Max</Label>
            <input
              id="maxPrice"
              type="number"
              min={0}
              max={10000}
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">Conditions</Label>
        {renderCheckboxGroup(conditionOptions, 'conditions')}
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">Delivery Methods</Label>
        {renderCheckboxGroup(deliveryMethodOptions, 'deliveryMethods')}
      </div>
    </div>
  );
};

export default ProductFilter;