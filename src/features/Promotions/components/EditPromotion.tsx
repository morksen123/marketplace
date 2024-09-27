import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePromotions } from '../hooks/usePromotions';
import { Promotion } from '../constants';
import { Button } from '@/components/ui/button';
import { PromotionForm } from './PromotionForm';

const EditPromotion: React.FC = () => {
  const { promotionId } = useParams<{ promotionId: string }>();
  const navigate = useNavigate();
  const { getPromotion, editPromotion } = usePromotions();
  const {
    data: promotion,
    isLoading,
    isError,
  } = getPromotion(Number(promotionId));
  const [formData, setFormData] = useState<Promotion | null>(null);

  useEffect(() => {
    if (promotion) {
      setFormData(promotion);
    }
  }, [promotion]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleStatusChange = (newStatus: Promotion['status']) => {
    setFormData((prev) => (prev ? { ...prev, status: newStatus } : null));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    if (formData) {
      editPromotion({ id: Number(promotionId), data: formData });
      navigate('/distributor/promotions');
    }
  };

  const handleBack = () => {
    navigate('/distributor/promotions');
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading promotion</div>;
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
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleBack}>
            Cancel
          </Button>
          <Button type="submit" variant="secondary">Edit Promotion</Button>
        </div>
      </form>
    </div>
  );
};

export default EditPromotion;
