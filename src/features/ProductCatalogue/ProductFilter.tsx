import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const ProductFilter = ({ onFilter }) => {
  const [categories, setCategories] = React.useState<string[]>([]);
  const [minPrice, setMinPrice] = React.useState(0);
  const [maxPrice, setMaxPrice] = React.useState(1000);
  const [conditions, setConditions] = React.useState<string[]>([]);
  const [deliveryMethods, setDeliveryMethods] = React.useState<string[]>([]);

  const handleCategoryChange = (category: string) => {
    setCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleConditionChange = (condition: string) => {
    setConditions(prev => 
      prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]
    );
  };

  const handleDeliveryMethodChange = (method: string) => {
    setDeliveryMethods(prev => 
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
    );
  };

  const handleApplyFilter = () => {
    onFilter({
      categories,
      minPrice,
      maxPrice,
      conditions,
      deliveryMethods
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Filters</h2>

      <div className="space-y-2">
        <Label className="text-base font-medium">Categories</Label>
        {["CANNED_GOODS", "DAIRY_AND_EGGS", "DRY_GOODS_AND_STAPLES", "FRUITS_AND_VEGETABLES", "FROZEN"].map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox 
              id={category} 
              checked={categories.includes(category)}
              onCheckedChange={() => handleCategoryChange(category)}
              className="mr-2 border-gray-300 text-red-600 focus:ring-red-500"
            />
            <Label htmlFor={category} className="capitalize">{category.replace(/_/g, ' ').toLowerCase()}</Label>
          </div>
        ))}
      </div>

      <div>
        <Label className="text-base font-medium">Price Range</Label>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={[minPrice, maxPrice]}
          onValueChange={([min, max]) => {
            setMinPrice(min);
            setMaxPrice(max);
          }}
        />
        <div className="flex justify-between">
          <span>${minPrice}</span>
          <span>${maxPrice}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium">Conditions</Label>
        {["BRUISED", "DAMAGED_PACKAGING", "NEAR_EXPIRY", "UGLY"].map((condition) => (
          <div key={condition} className="flex items-center space-x-2">
            <Checkbox 
              id={condition} 
              checked={conditions.includes(condition)}
              onCheckedChange={() => handleConditionChange(condition)}
              className="mr-2 border-gray-300 text-red-600 focus:ring-red-500"
            />
            <Label htmlFor={condition} className="capitalize">{condition.replace(/_/g, ' ').toLowerCase()}</Label>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium">Delivery Methods</Label>
        {["SELF_PICK_UP", "DOORSTEP_DELIVERY"].map((method) => (
          <div key={method} className="flex items-center space-x-2">
            <Checkbox 
              id={method} 
              checked={deliveryMethods.includes(method)}
              onCheckedChange={() => handleDeliveryMethodChange(method)}
              className="mr-2 border-gray-300 text-red-600 focus:ring-red-500"
            />
            <Label htmlFor={method} className="capitalize">{method.replace(/_/g, ' ').toLowerCase()}</Label>
          </div>
        ))}
      </div>

      <Button variant="secondary" onClick={handleApplyFilter}>Apply Filters</Button>
    </div>
  );
};

export default ProductFilter;