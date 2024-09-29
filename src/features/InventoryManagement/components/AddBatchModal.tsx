import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Product } from '@/features/ProductListing/constants';
import { styled } from '@mui/material/styles';

const StyledFormControl = styled(FormControl)({
  '& .MuiInputLabel-root': {
    transform: 'translate(14px, -9px) scale(0.75)',
    background: 'white',
    padding: '0 8px',
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(14px, -9px) scale(0.75)',
  },
  '& .MuiSelect-select': {
    paddingTop: '16px',
    paddingBottom: '16px',
  },
});

interface AddBatchModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (productId: string, quantity: number, bestBeforeDate: string) => void;
  products: Product[];
}

export const AddBatchModal: React.FC<AddBatchModalProps> = ({ open, onClose, onSave, products }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [bestBeforeDate, setBestBeforeDate] = useState('');

  const handleSave = () => {
    if (selectedProductId && quantity && bestBeforeDate) {
      onSave(selectedProductId, parseInt(quantity), bestBeforeDate);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Batch</DialogTitle>
      <DialogContent>
        <StyledFormControl fullWidth margin="normal">
          <InputLabel id="product-select-label">Product</InputLabel>
          <Select
            labelId="product-select-label"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value as string)}
            label="Product"
          >
            {products.map((product) => (
              <MenuItem key={product.productId} value={product.productId}>
                {product.listingTitle}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Best Before Date"
          type="date"
          value={bestBeforeDate}
          onChange={(e) => setBestBeforeDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outline">Cancel</Button>
        <Button onClick={handleSave} variant="secondary">Add Batch</Button>
      </DialogActions>
    </Dialog>
  );
};
