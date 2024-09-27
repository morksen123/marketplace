import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePromotions } from '../hooks/usePromotions';
import { Promotion } from '../constants';
import { Button } from '@/components/ui/button';
import { PromotionForm } from './PromotionForm';
import { useDistributor } from '@/features/DIstributorAccount/hooks/useDistributor';
import { Product } from '@/features/ProductCatalogue/constants';
import { ProductSelector } from './ProductSelector';

const CreatePromotion: React.FC = () => {
  const navigate = useNavigate();

  const { createPromotion } = usePromotions();
  const [formData, setFormData] = useState<Promotion>({
    promotionId: 0,
    promotionName: '',
    description: '',
    discountPercentage: 0,
    startDate: '',
    endDate: '',
    status: 'ACTIVE',
    productIds: [],
    distributorId: 0,
  });

  const { activeProducts, distributorProfile } = useDistributor();
  const [applicableProducts, setApplicableProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (activeProducts) {
      setApplicableProducts(activeProducts);
      // Update formData with product IDs from activeProducts
      setFormData((prev) => ({
        ...prev,
        productIds: activeProducts.map((product) => product.productId),
        distributorId: distributorProfile?.distributorId ?? 0
      }));
    }
  }, [activeProducts]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (newStatus: Promotion['status']) => {
    setFormData((prev) => ({ ...prev, status: newStatus }));
  };

  const handleSelectedProductsChange = (selectedProductIds: number[]) => {
    setFormData(prev => ({ ...prev, productIds: selectedProductIds }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPromotion(formData);
    navigate('/distributor/promotions');
  };

  const handleBack = () => {
    navigate('/distributor/promotions');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Promotion</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <PromotionForm
          formData={formData}
          handleChange={handleChange}
          handleStatusChange={handleStatusChange}
        />
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Select Applicable Products</h2>
          <ProductSelector
            products={applicableProducts}
            onSelectedProductsChange={handleSelectedProductsChange}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleBack}>
            Cancel
          </Button>
          <Button type="submit" variant="secondary">
            Create Promotion
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePromotion;
