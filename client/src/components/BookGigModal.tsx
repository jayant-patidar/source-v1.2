import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useGigStore } from '../store/gigStore';
import { useToastStore } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

interface BookGigModalProps {
  open: boolean;
  onClose: () => void;
  gig: any;
}

const validationSchema = yup.object({
  jobDate: yup.date().required('Booking Date is required').min(new Date(new Date().setHours(0,0,0,0)), 'Cannot book in the past'),
  jobTime: yup.string().required('Booking Time is required'),
  generalLocation: yup.string().required('General Area is required'),
  exactLocation: yup.string().required('Exact Address is required'),
});

const BookGigModal = ({ open, onClose, gig }: BookGigModalProps) => {
  const { bookGig } = useGigStore();
  const { showToast } = useToastStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      jobDate: '',
      jobTime: '',
      generalLocation: user?.address || '',
      exactLocation: '',
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!user) {
        showToast('Please login to book a service', 'warning');
        navigate('/login');
        return;
      }
      setIsSubmitting(true);
      try {
        await bookGig(gig._id, values);
        showToast('Gig Booked Successfully! View it in your Activity.', 'success');
        onClose();
        // Reset form
        formik.resetForm();
      } catch (error: any) {
        showToast(error.message || 'Failed to book gig', 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        Book Gig: {gig?.title}
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          You are booking this service for a fixed price of <strong>${gig?.price}</strong>.
          Please provide the time and location details below.
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              id="jobDate"
              name="jobDate"
              label="Booking Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formik.values.jobDate}
              onChange={formik.handleChange}
              error={formik.touched.jobDate && Boolean(formik.errors.jobDate)}
              helperText={formik.touched.jobDate && formik.errors.jobDate}
            />
            <TextField
              fullWidth
              id="jobTime"
              name="jobTime"
              label="Booking Time"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={formik.values.jobTime}
              onChange={formik.handleChange}
              error={formik.touched.jobTime && Boolean(formik.errors.jobTime)}
              helperText={formik.touched.jobTime && formik.errors.jobTime}
            />
          </Box>
          <TextField
            fullWidth
            id="generalLocation"
            name="generalLocation"
            label="General Location (City/Area)"
            margin="normal"
            value={formik.values.generalLocation}
            onChange={formik.handleChange}
            error={formik.touched.generalLocation && Boolean(formik.errors.generalLocation)}
            helperText={formik.touched.generalLocation && formik.errors.generalLocation}
          />
          <TextField
            fullWidth
            id="exactLocation"
            name="exactLocation"
            label="Exact Location (Address)"
            margin="normal"
            value={formik.values.exactLocation}
            onChange={formik.handleChange}
            error={formik.touched.exactLocation && Boolean(formik.errors.exactLocation)}
            helperText={formik.touched.exactLocation && formik.errors.exactLocation}
          />
        </form>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={() => formik.handleSubmit()} 
          variant="contained" 
          disabled={isSubmitting}
          sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: '#333' } }}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Confirm Booking'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookGigModal;
