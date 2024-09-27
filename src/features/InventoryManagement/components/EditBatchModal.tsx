import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Batch } from '@/features/ProductListing/constants';

interface EditBatchModalProps {
  open: boolean;
  onClose: () => void;
  batch: Batch | null;
  onSave: (updatedBatch: Batch) => void;
}

export const EditBatchModal: React.FC<EditBatchModalProps> = ({ open, onClose, batch, onSave }) => {
  const [editedBatch, setEditedBatch] = React.useState<Batch | null>(null);
  const [dateError, setDateError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setEditedBatch(batch);
    setDateError(null);
  }, [batch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedBatch) {
      const { name, value } = e.target;
      setEditedBatch({
        ...editedBatch,
        [name]: value,
      });

      // Validate date when it changes
      if (name === 'bestBeforeDate') {
        validateDate(value);
      }
    }
  };

  const validateDate = (date: string) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

    if (selectedDate < today) {
      setDateError("Best Before Date cannot be earlier than today");
    } else {
      setDateError(null);
    }
  };

  const handleSave = () => {
    if (editedBatch && !dateError) {
      onSave(editedBatch);
      onClose();
    }
  };

  if (!editedBatch) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      aria-labelledby="edit-batch-dialog-title"
      disableEnforceFocus // Add this line
      disableAutoFocus // Add this line
    >
      <DialogTitle id="edit-batch-dialog-title">Edit Batch</DialogTitle>
      <DialogContent>
        <TextField
          name="quantity"
          label="Quantity"
          type="number"
          value={editedBatch.quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="bestBeforeDate"
          label="Best Before Date"
          type="date"
          value={editedBatch.bestBeforeDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          error={!!dateError}
          helperText={dateError}
          inputProps={{
            min: new Date().toISOString().split('T')[0], // Set min date to today
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outline">Cancel</Button>
        <Button onClick={handleSave} variant="secondary" disabled={!!dateError}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
