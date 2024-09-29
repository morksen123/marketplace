import React, { useState, useEffect } from 'react';
import { Product } from '@/features/ProductCatalogue/constants';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ProductSelectorProps {
  products: Product[];
  selectedProductIds: number[];
  onSelectedProductsChange: (selectedProductIds: number[]) => void;
  isEdit?: boolean;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  onSelectedProductsChange,
  selectedProductIds, 
  isEdit = false,
}) => {
  const [applicationType, setApplicationType] = useState<
    'all' | 'individual' | 'category' | 'expiration'
  >('individual');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedDeliveryMethods, setSelectedDeliveryMethods] = useState<
    string[]
  >([]);
  const [selectedIndividualProducts, setSelectedIndividualProducts] = useState<
    number[]
  >(selectedProductIds);
  const [expirationCriteria, setExpirationCriteria] = useState({
    type: 'specific',
    specificDate: '',
    dateRange: { start: '', end: '' },
    relativePeriod: { value: '', unit: 'days' as 'days' | 'weeks' | 'months' },
  });

  const categories = Array.from(new Set(products.map((p) => p.foodCategory)));
  const conditions = Array.from(new Set(products.map((p) => p.foodCondition)));
  const deliveryMethods = Array.from(
    new Set(products.map((p) => p.deliveryMethod)),
  );

  const handleApplicationTypeChange = (value: typeof applicationType) => {
    setApplicationType(value);
    updateSelectedProducts(value);
  };

  const handleCheckboxChange = (
    category: 'categories' | 'conditions' | 'deliveryMethods',
    item: string,
  ) => {
    const updateFunction = {
      categories: setSelectedCategories,
      conditions: setSelectedConditions,
      deliveryMethods: setSelectedDeliveryMethods,
    }[category];

    updateFunction((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const handleExpirationUpdate = (data: any) => {
    setExpirationCriteria((prev) => ({ ...prev, ...data }));
  };

  const updateSelectedProducts = (type: typeof applicationType) => {
    let selectedProductIds: number[] = [];
    switch (type) {
      case 'all':
        selectedProductIds = products.map((p) => p.productId);
        console.log(selectedProductIds);
        break;
      case 'individual':
        selectedProductIds = selectedIndividualProducts;
        console.log(selectedProductIds);
        break;
      case 'category':
        selectedProductIds = products
          .filter(
            (p) =>
              (selectedCategories.length === 0 ||
                selectedCategories.includes(p.foodCategory)) &&
              (selectedConditions.length === 0 ||
                selectedConditions.includes(p.foodCondition)) &&
              (selectedDeliveryMethods.length === 0 ||
                selectedDeliveryMethods.includes(p.deliveryMethod)),
          )
          .map((p) => p.productId);
        console.log(selectedProductIds);
        break;
      // case 'expiration':
      //   // Implement expiration-based logic here
      //   break;
    }
    
    onSelectedProductsChange(selectedProductIds);
  };

  const handleIndividualProductChange = (productId: number) => {
    setSelectedIndividualProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  useEffect(() => {
    if (applicationType === 'individual') {
      onSelectedProductsChange(selectedIndividualProducts);
    }
  }, [selectedIndividualProducts, applicationType]);

  useEffect(() => {
    updateSelectedProducts(applicationType);
  }, [
    selectedCategories,
    selectedConditions,
    selectedDeliveryMethods,
    selectedIndividualProducts,
    expirationCriteria,
  ]);

  const renderApplicationOptions = () => {
    if (isEdit) {
      return (
        <div className="mt-4">
          <Label>Select Individual Products</Label>
          {products.map((product) => (
            <div
              key={product.productId}
              className="flex items-center space-x-2 mb-2"
            >
              <Checkbox
                id={product.productId.toString()}
                checked={selectedIndividualProducts.includes(product.productId)}
                onCheckedChange={() =>
                  handleIndividualProductChange(product.productId)
                }
                className="border-gray-300"
              />
              <label htmlFor={product.listingTitle}>
                {product.listingTitle}
              </label>
            </div>
          ))}
        </div>
      );
    }

    switch (applicationType) {
      case 'individual':
        return (
          <div className="mt-4">
            <Label>Select Individual Products</Label>
            {products.map((product) => (
              <div
                key={product.productId}
                className="flex items-center space-x-2 mb-2"
              >
                <Checkbox
                  id={product.productId.toString()}
                  checked={selectedIndividualProducts.includes(
                    product.productId,
                  )}
                  onCheckedChange={() =>
                    handleIndividualProductChange(product.productId)
                  }
                  className="border-gray-300"
                />
                <label htmlFor={product.listingTitle}>
                  {product.listingTitle}
                </label>
              </div>
            ))}
          </div>
        );
      case 'category':
        return (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">Category</h4>
              {categories.map((category) => (
                <div
                  key={category}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() =>
                      handleCheckboxChange('categories', category)
                    }
                    className="border-gray-300"
                  />
                  <label htmlFor={category}>
                    {category
                      .replace(/_/g, ' ')
                      .split(' ')
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase(),
                      )
                      .join(' ')}
                  </label>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-medium mb-2">Food Condition</h4>
              {conditions.map((condition) => (
                <div
                  key={condition}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Checkbox
                    id={condition}
                    checked={selectedConditions.includes(condition)}
                    onCheckedChange={() =>
                      handleCheckboxChange('conditions', condition)
                    }
                    className="border-gray-300"
                  />
                  <label htmlFor={condition}>
                    {condition
                      .replace(/_/g, ' ')
                      .split(' ')
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase(),
                      )
                      .join(' ')}
                  </label>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-medium mb-2">Delivery Method</h4>
              {deliveryMethods.map((method) => (
                <div key={method} className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={method}
                    checked={selectedDeliveryMethods.includes(method)}
                    onCheckedChange={() =>
                      handleCheckboxChange('deliveryMethods', method)
                    }
                    className="border-gray-300"
                  />
                  <label htmlFor={method}>
                    {method
                      .replace(/_/g, ' ')
                      .split(' ')
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase(),
                      )
                      .join(' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
        // case 'expiration':
        return (
          <div className="mt-4">
            <Label>Select Expiration Option</Label>
            <RadioGroup
              value={expirationCriteria.type}
              onValueChange={(value: 'specific' | 'range' | 'relative') =>
                handleExpirationUpdate({ type: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="specific"
                  id="specific"
                  className="border-gray-300 text-primary-foreground focus:ring-primary"
                />
                <Label htmlFor="specific">Specific Date</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="range"
                  id="range"
                  className="border-gray-300 text-primary-foreground focus:ring-primary"
                />
                <Label htmlFor="range">Date Range</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="relative"
                  id="relative"
                  className="border-gray-300 text-primary-foreground focus:ring-primary"
                />
                <Label htmlFor="relative">Relative Period</Label>
              </div>
            </RadioGroup>
            {expirationCriteria.type === 'specific' && (
              <Input
                type="date"
                value={expirationCriteria.specificDate}
                onChange={(e) =>
                  handleExpirationUpdate({ specificDate: e.target.value })
                }
                className="mt-2"
              />
            )}
            {expirationCriteria.type === 'range' && (
              <div className="flex space-x-2 mt-2">
                <Input
                  type="date"
                  value={expirationCriteria.dateRange.start}
                  onChange={(e) =>
                    handleExpirationUpdate({
                      dateRange: {
                        ...expirationCriteria.dateRange,
                        start: e.target.value,
                      },
                    })
                  }
                />
                <Input
                  type="date"
                  value={expirationCriteria.dateRange.end}
                  onChange={(e) =>
                    handleExpirationUpdate({
                      dateRange: {
                        ...expirationCriteria.dateRange,
                        end: e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}
            {expirationCriteria.type === 'relative' && (
              <div className="flex space-x-2 mt-2">
                <Input
                  type="number"
                  value={expirationCriteria.relativePeriod.value}
                  onChange={(e) =>
                    handleExpirationUpdate({
                      relativePeriod: {
                        ...expirationCriteria.relativePeriod,
                        value: e.target.value,
                      },
                    })
                  }
                  placeholder="Number"
                />
                <Select
                  value={expirationCriteria.relativePeriod.unit}
                  onValueChange={(value: 'days' | 'weeks' | 'months') =>
                    handleExpirationUpdate({
                      relativePeriod: {
                        ...expirationCriteria.relativePeriod,
                        unit: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {!isEdit && (
        <Select onValueChange={handleApplicationTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select application type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="individual">
              Apply by Individual Products
            </SelectItem>
            <SelectItem value="category">
              Apply by Category, Food Condition, Delivery Method
            </SelectItem>
            {/* <SelectItem value="expiration">Apply by Expiration Date</SelectItem> */}
          </SelectContent>
        </Select>
      )}

      {renderApplicationOptions()}
    </div>
  );
};
