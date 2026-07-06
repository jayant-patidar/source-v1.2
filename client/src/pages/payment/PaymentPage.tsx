import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Grid, TextField, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { jobService } from '../../services/job.service';
import { transactionService } from '../../services/transaction.service';
import { useToastStore } from '../../store/toastStore';
import { useTransactionStore } from '../../store/transactionStore';

import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EmailIcon from '@mui/icons-material/Email';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface Job {
  _id: string;
  title: string;
  originalPay: number;
  currentPay?: number;
  providerId?: { name: string; _id: string };
  seekerId: string | { _id: string };
}

const PaymentOptionCard = ({ 
  value, 
  currentValue, 
  onClick, 
  icon, 
  title, 
  description,
  children
}: { 
  value: string; 
  currentValue: string; 
  onClick: (val: string) => void;
  icon: React.ReactNode;
  title: string;
  description: string | React.ReactNode;
  children?: React.ReactNode;
}) => {
  const isSelected = value === currentValue;
  
  return (
    <Paper 
      elevation={0}
      onClick={() => onClick(value)}
      sx={{ 
        p: 3, 
        mb: 2, 
        cursor: 'pointer',
        borderRadius: 4,
        border: '2px solid',
        borderColor: isSelected ? '#4f46e5' : 'transparent',
        bgcolor: isSelected ? 'rgba(79, 70, 229, 0.03)' : 'white',
        boxShadow: isSelected ? '0 8px 24px rgba(79, 70, 229, 0.15)' : '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: isSelected ? '#4f46e5' : 'rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Box sx={{ 
          p: 1.5, 
          borderRadius: 3, 
          bgcolor: isSelected ? '#4f46e5' : '#f1f5f9',
          color: isSelected ? 'white' : '#64748b',
          display: 'flex'
        }}>
          {icon}
        </Box>
        <Box flexGrow={1}>
          <Typography variant="h6" fontWeight="bold" fontSize="1.1rem">{title}</Typography>
          <Typography variant="body2" color="text.secondary" component="div">{description}</Typography>
        </Box>
      </Box>
      
      {/* Expandable Content Area */}
      <Box sx={{ 
        maxHeight: isSelected ? '500px' : 0, 
        overflow: 'hidden', 
        transition: 'max-height 0.3s ease',
        opacity: isSelected ? 1 : 0
      }}>
        {children && <Box sx={{ mt: 3, pt: 3, borderTop: '1px dashed #e2e8f0' }}>{children}</Box>}
      </Box>
    </Paper>
  );
};

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToastStore();
  const { balance, fetchBalance, purchaseCoins } = useTransactionStore();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('sourcecoin');
  const [processing, setProcessing] = useState(false);

  // Topup Modal State
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [topupMethod, setTopupMethod] = useState('credit_card');
  const [isToppingUp, setIsToppingUp] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!id) return;
        const data = await jobService.getJob(id);
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

  const totalAmount = job ? (job.currentPay || job.originalPay) : 0;
  const isSourceCoinSelected = paymentMethod === 'sourcecoin';
  const hasInsufficientSC = isSourceCoinSelected && balance < totalAmount;

  const handlePayment = async () => {
    if (!job) return;
    setProcessing(true);

    try {
      const payload = {
        jobId: job._id,
        payorId: typeof job.seekerId === 'object' ? (job.seekerId as any)._id : job.seekerId,
        payeeId: typeof job.providerId === 'object' ? (job.providerId as any)._id : job.providerId,
        amount: totalAmount,
        paymentMethod,
        metadata: {
           note: 'Payment for service'
        }
      };

      await transactionService.transferCoins(payload.jobId, payload.payeeId, payload.amount);
      showToast('Payment successful!', 'success');
      navigate('/activity');
    } catch (error: any) {
      console.error(error);
      showToast('Payment failed. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleTopup = async () => {
    if (!topupAmount || Number(topupAmount) <= 0) {
      return showToast('Please enter a valid amount.', 'error');
    }
    setIsToppingUp(true);
    try {
      await purchaseCoins(Number(topupAmount), topupMethod);
      showToast(`Successfully added ${topupAmount} SC to your wallet!`, 'success');
      setIsTopupOpen(false);
      setTopupAmount('');
      // Balance is auto-refreshed via store
    } catch (error: any) {
      showToast(error.message || 'Failed to purchase coins', 'error');
    } finally {
      setIsToppingUp(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" height="100vh" alignItems="center"><CircularProgress /></Box>;
  if (!job) return null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 10 }}>
      {/* Dark Premium Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
        pt: 8,
        pb: 8,
        px: 4,
        textAlign: 'center',
        position: 'relative'
      }}>
        <Typography variant="h3" fontWeight="900" letterSpacing="-1px">
          Complete Your Payment
        </Typography>
        <Typography variant="body1" sx={{ color: '#94a3b8', mt: 2, fontSize: '1.1rem' }}>
          Choose how you'd like to fund this job. Secure and encrypted.
        </Typography>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 2, md: 4 }, mt: 4, position: 'relative', zIndex: 10 }}>
        <Grid container spacing={4}>
          {/* Left Column: Payment Methods */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box>
              
              <PaymentOptionCard 
                value="sourcecoin" 
                currentValue={paymentMethod} 
                onClick={setPaymentMethod}
                icon={<AccountBalanceWalletIcon />}
                title="SourceCoin (SC)"
                description={
                  <span style={{ color: hasInsufficientSC ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                    Available Balance: {balance} SC
                  </span>
                }
              >
                {hasInsufficientSC ? (
                  <Box sx={{ bgcolor: 'rgba(239, 68, 68, 0.05)', p: 3, borderRadius: 3, textAlign: 'center' }}>
                    <Typography color="error" fontWeight="bold" gutterBottom>
                      Insufficient Balance
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      You need {totalAmount - balance} more SourceCoins to complete this transaction.
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="error" 
                      onClick={() => {
                        setTopupAmount(String(totalAmount - balance));
                        setIsTopupOpen(true);
                      }}
                      sx={{ borderRadius: 2, px: 4 }}
                    >
                      Top Up Wallet Now
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Your SourceCoin wallet will be debited {totalAmount} SC instantly.
                  </Typography>
                )}
              </PaymentOptionCard>

              <PaymentOptionCard 
                value="credit_card" 
                currentValue={paymentMethod} 
                onClick={setPaymentMethod}
                icon={<CreditCardIcon />}
                title="Credit / Debit Card"
                description="Secure card payment via Stripe"
              >
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
              </PaymentOptionCard>

              <PaymentOptionCard 
                value="paypal" 
                currentValue={paymentMethod} 
                onClick={setPaymentMethod}
                icon={<AccountBalanceIcon />}
                title="PayPal"
                description="Connect your PayPal account"
              >
                <Box textAlign="center">
                  <Button variant="contained" sx={{ bgcolor: '#0070ba', color: 'white', '&:hover': { bgcolor: '#003087' }, borderRadius: 2, px: 4 }}>
                    Connect PayPal
                  </Button>
                </Box>
              </PaymentOptionCard>

              <PaymentOptionCard 
                value="etransfer" 
                currentValue={paymentMethod} 
                onClick={setPaymentMethod}
                icon={<EmailIcon />}
                title="E-Transfer"
                description="Manual bank transfer"
              >
                <Box>
                  <Typography variant="body2" gutterBottom>Send to: <strong>payments@sourceapp.com</strong></Typography>
                  <TextField label="Reference Number" fullWidth size="small" placeholder="Enter transfer reference" />
                </Box>
              </PaymentOptionCard>

            </Box>
          </Grid>

          {/* Right Column: Order Summary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ 
              p: 4, 
              borderRadius: 4, 
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
              position: 'sticky',
              top: 24,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Typography variant="h5" fontWeight="900" gutterBottom>Receipt</Typography>
              <Box sx={{ borderBottom: '2px dashed #e2e8f0', my: 3 }} />
              
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography color="text.secondary" fontSize="1.1rem">Service</Typography>
                <Typography fontWeight="bold" fontSize="1.1rem" textAlign="right" sx={{ maxWidth: '60%' }}>{job.title}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography color="text.secondary" fontSize="1.1rem">Provider</Typography>
                <Typography fontWeight="medium" fontSize="1.1rem">{job.providerId?.name || 'Provider'}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography color="text.secondary" fontSize="1.1rem">Platform Fee</Typography>
                <Typography fontWeight="medium" fontSize="1.1rem" color="success.main">Free</Typography>
              </Box>

              <Box sx={{ borderBottom: '2px dashed #e2e8f0', my: 3 }} />
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h5" fontWeight="bold">Total</Typography>
                <Typography variant="h4" fontWeight="900" color="#4f46e5">${totalAmount}</Typography>
              </Box>

              <Button 
                variant="contained" 
                fullWidth 
                size="large" 
                onClick={handlePayment}
                disabled={processing || hasInsufficientSC}
                sx={{ 
                  py: 2, 
                  borderRadius: 3,
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  bgcolor: hasInsufficientSC ? 'action.disabledBackground' : '#000',
                  color: hasInsufficientSC ? 'action.disabled' : '#fff',
                  boxShadow: hasInsufficientSC ? 'none' : '0 10px 20px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#333',
                    transform: hasInsufficientSC ? 'none' : 'translateY(-2px)'
                  }
                }}
              >
                {processing ? <CircularProgress size={28} color="inherit" /> : hasInsufficientSC ? 'Insufficient SC' : `Pay $${totalAmount}`}
              </Button>

              <Typography variant="caption" display="block" textAlign="center" color="text.secondary" mt={2}>
                Payments are securely processed and held in escrow.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* JIT Topup Modal */}
      <Dialog open={isTopupOpen} onClose={() => setIsTopupOpen(false)} PaperProps={{ sx: { borderRadius: 4, p: 2, maxWidth: 400, width: '100%' } }}>
        <DialogTitle variant="h5" fontWeight="bold">Top Up Wallet</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Purchase SourceCoins (SC) to quickly checkout without external fees. 1 SC = $1 USD.
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            label="Amount of SourceCoins"
            type="number"
            fullWidth
            value={topupAmount}
            onChange={(e) => setTopupAmount(e.target.value)}
            slotProps={{ input: { startAdornment: <Typography fontWeight="bold" mr={1}>SC</Typography> } }}
            sx={{ mb: 3 }}
          />
          
          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={topupMethod}
              label="Payment Method"
              onChange={(e) => setTopupMethod(e.target.value)}
            >
              <MenuItem value="credit_card">Credit / Debit Card</MenuItem>
              <MenuItem value="etransfer">E-Transfer</MenuItem>
              <MenuItem value="paypal">PayPal</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setIsTopupOpen(false)} color="inherit" sx={{ fontWeight: 'bold' }}>Cancel</Button>
          <Button 
            onClick={handleTopup} 
            variant="contained" 
            disabled={isToppingUp || !topupAmount}
            sx={{ borderRadius: 2, px: 3, bgcolor: '#4f46e5' }}
          >
            {isToppingUp ? <CircularProgress size={24} color="inherit" /> : `Buy ${topupAmount || 0} SC`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentPage;
