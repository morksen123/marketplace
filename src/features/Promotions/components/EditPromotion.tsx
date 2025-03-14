import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePromotions } from '../hooks/usePromotions';
import { Promotion } from '../constants';
import { Button } from '@/components/ui/button';
import { PromotionForm } from './PromotionForm';
import { ProductSelector } from './ProductSelector';
import { useDistributor } from '@/features/DIstributorAccount/hooks/useDistributor';
import { Product } from '@/features/ProductCatalogue/constants';

const EditPromotion: React.FC = () => {
  const { promotionId } = useParams<{ promotionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getPromotion, editPromotion, getPromotionProducts } = usePromotions();
  const {
    data: promotion,
    isLoading: isPromotionLoading,
    isError: isPromotionError,
  } = getPromotion(Number(promotionId));
  const { activeProducts } = useDistributor();

  const [formData, setFormData] = useState<Promotion | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [applicableProducts, setApplicableProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (promotion) {
      setFormData(promotion);
      setSelectedProductIds(promotion.productIds || []);
    }
  }, [promotion]);

  useEffect(() => {
    if(activeProducts) {
      setApplicableProducts(activeProducts);
    }
  }, [activeProducts]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleStatusChange = (newStatus: Promotion['status']) => {
    setFormData((prev) => (prev ? { ...prev, status: newStatus } : null));
  };

  const handleSelectedProductsChange = (newSelectedProductIds: number[]) => {
    setSelectedProductIds(newSelectedProductIds);
    setFormData((prev) => prev ? { ...prev, productIds: newSelectedProductIds } : null);
  };

  const handleBack = () => {
    if (location.state?.from === 'product') {
      navigate(`/view-product-listing/${location.state.productId}`);
    } else {
      navigate('/distributor/promotions');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    if (formData) {
      await editPromotion({ id: Number(promotionId), data: formData });
    }
  };

  if (isPromotionLoading) return <div>Loading...</div>;
  if (isPromotionError) return <div>Error loading promotion or products</div>;
  if (!formData) return <div>Promotion not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Promotion</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <PromotionForm
          formData={formData}
          handleChange={handleChange}
          handleStatusChange={handleStatusChange}
        />
        <ProductSelector
          products={applicableProducts}
          selectedProductIds={selectedProductIds}
          isEdit={true}
          onSelectedProductsChange={handleSelectedProductsChange}
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleBack}>
            Cancel
          </Button>
          <Button type="submit" variant="secondary">
            Save Promotion Edits
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPromotion;
