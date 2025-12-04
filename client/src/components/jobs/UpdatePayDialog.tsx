import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  InputAdornment
} from '@mui/material';

interface UpdatePayDialogProps {
  open: boolean;
  onClose: () => void;
  currentPay: number;
  jobId: string;
  onSave: (jobId: string, updatedData: any) => Promise<void>;
}

const UpdatePayDialog: React.FC<UpdatePayDialogProps> = ({ open, onClose, currentPay, jobId, onSave }) => {
  const [newPay, setNewPay] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
        setNewPay(currentPay?.toString() || '');
    }
  }, [open, currentPay]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSave(jobId, { pay: Number(newPay) });
      onClose();
    } catch (error) {
      console.error('Failed to update pay', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Update Pay</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
            Current Pay: ${currentPay}
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="New Pay Amount"
          type="number"
          fullWidth
          variant="outlined"
          value={newPay}
          onChange={(e) => setNewPay(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading || !newPay || Number(newPay) === currentPay}>
          {loading ? 'Updating...' : 'Update Pay'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePayDialog;
