import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Grid, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, Divider, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useToastStore } from '../../store/toastStore';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EmailIcon from '@mui/icons-material/Email';

interface Job {
  _id: string;
  title: string;
  originalPay: number;
  currentPay?: number;
  providerId?: { name: string; _id: string };
  seekerId: string;
}

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToastStore();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/jobs/${id}`, { withCredentials: true });
        setJob(data);
      } catch (error) {
        showToast('Failed to load job details', 'error');
        navigate('/activity');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate, showToast]);

  const handlePayment = async () => {
    if (!job) return;
    setProcessing(true);

    try {
      const amount = job.currentPay || job.originalPay;
      const payload = {
        jobId: job._id,
        payorId: typeof job.seekerId === 'object' ? (job.seekerId as any)._id : job.seekerId,
        payeeId: typeof job.providerId === 'object' ? (job.providerId as any)._id : job.providerId,
        amount,
        paymentMethod,
        metadata: {
           note: 'Payment for service'
        }
      };

      await axios.post('http://localhost:5000/api/transactions', payload, { withCredentials: true });
      showToast('Payment successful!', 'success');
      navigate('/activity');
    } catch (error) {
      console.error(error);
      showToast('Payment failed. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" height="100vh" alignItems="center"><CircularProgress /></Box>;
  if (!job) return null;

  const totalAmount = job.currentPay || job.originalPay;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Checkout</Typography>
      
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h6" gutterBottom>Payment Method</Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                
                {/* Credit Card Option */}
                <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: paymentMethod === 'credit_card' ? 'action.selected' : 'transparent', borderColor: paymentMethod === 'credit_card' ? 'primary.main' : 'divider' }}>
                  <FormControlLabel value="credit_card" control={<Radio />} label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <CreditCardIcon /> 
                      <Typography fontWeight="bold">Credit / Debit Card</Typography>
                    </Box>
                  } />
                  {paymentMethod === 'credit_card' && (
                    <Box sx={{ mt: 2, pl: 4 }}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                          <TextField label="Card Number" fullWidth size="small" placeholder="0000 0000 0000 0000" />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <TextField label="Expiry" fullWidth size="small" placeholder="MM/YY" />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <TextField label="CVV" fullWidth size="small" placeholder="123" />
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Paper>

                {/* PayPal Option */}
                 <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: paymentMethod === 'paypal' ? 'action.selected' : 'transparent', borderColor: paymentMethod === 'paypal' ? 'primary.main' : 'divider' }}>
                  <FormControlLabel value="paypal" control={<Radio />} label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccountBalanceIcon /> 
                      <Typography fontWeight="bold">PayPal</Typography>
                    </Box>
                  } />
                   {paymentMethod === 'paypal' && (
                    <Box sx={{ mt: 2, pl: 4 }}>
                        <Button variant="contained" color="primary">Connect PayPal</Button>
                    </Box>
                  )}
                </Paper>

                {/* E-Transfer Option */}
                 <Paper variant="outlined" sx={{ p: 2, mb: 0, bgcolor: paymentMethod === 'etransfer' ? 'action.selected' : 'transparent', borderColor: paymentMethod === 'etransfer' ? 'primary.main' : 'divider' }}>
                  <FormControlLabel value="etransfer" control={<Radio />} label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <EmailIcon /> 
                      <Typography fontWeight="bold">E-Transfer</Typography>
                    </Box>
                  } />
                   {paymentMethod === 'etransfer' && (
                    <Box sx={{ mt: 2, pl: 4 }}>
                        <Typography variant="body2" gutterBottom>Send to: <strong>payments@serviceapp.com</strong></Typography>
                        <TextField label="Reference Number" fullWidth size="small" placeholder="Enter transfer reference" />
                    </Box>
                  )}
                </Paper>

              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
           <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>Order Summary</Typography>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography color="text.secondary">Service</Typography>
                <Typography fontWeight="medium">{job.title}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography color="text.secondary">Provider</Typography>
                <Typography fontWeight="medium">{job.providerId?.name || 'Provider'}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary.main">${totalAmount}</Typography>
              </Box>
              <Button 
                variant="contained" 
                fullWidth 
                size="large" 
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? <CircularProgress size={24} /> : `Pay $${totalAmount}`}
              </Button>
           </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentPage;
