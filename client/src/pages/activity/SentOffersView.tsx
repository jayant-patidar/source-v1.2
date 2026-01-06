import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useToastStore } from '../../store/toastStore';


import { offerService } from '../../services/offer.service';

// Interface Negotiation is already defined nicely in this file, I will keep it or move it to models if I was stricter, but for now I'll just refactor the logic.

interface Negotiation {
  _id: string;
  job: {
    _id: string;
    title: string;
    status: string;
    originalPay: number;
  };
  seeker: {
    _id: string;
    name: string;
    avatar: string;
  };
  provider: {
    _id: string;
    name: string;
    avatar: string;
    providerRating: number;
  };
  amount: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  seekerCounterCount: number;
  providerCounterCount: number;
  lastActor: 'seeker' | 'provider';
  offerHistory: {
    amount: number;
    message?: string;
    actor: 'seeker' | 'provider';
    timestamp: Date;
  }[];
  createdAt: string;
}

const SentOffersView = () => {
  const [sentOffers, setSentOffers] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);
  const [counterOpen, setCounterOpen] = useState(false);
  const [selectedNegId, setSelectedNegId] = useState('');
  const [counterAmount, setCounterAmount] = useState('');
  const [counterMessage, setCounterMessage] = useState('');
  const { showToast } = useToastStore();

  const fetchOffers = async () => {
    try {
      const data = await offerService.getSentOffers();
      setSentOffers(data);
    } catch (error) {
      console.error('Error fetching sent offers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleAccept = async (negotiationId: string) => {
    try {
        await offerService.updateOfferStatus(negotiationId, 'accepted');
        showToast('Offer accepted', 'success');
        fetchOffers();
    } catch (err: any) {
        showToast(err.response?.data?.message || 'Failed to accept', 'error');
    }
  };

  const handleReject = async (negotiationId: string) => {
    try {
        await offerService.updateOfferStatus(negotiationId, 'rejected');
        showToast('Offer rejected', 'info');
        fetchOffers();
    } catch (err: any) {
        showToast(err.response?.data?.message || 'Failed to reject', 'error');
    }
  };

  const handleCounter = async () => {
      try {
          await offerService.counterOffer(selectedNegId, Number(counterAmount), counterMessage);
          showToast('Counter offer sent!', 'success');
          setCounterOpen(false);
          setCounterAmount('');
          setCounterMessage('');
          fetchOffers();
      } catch (err: any) {
          showToast(err.response?.data?.message || 'Failed to send counter', 'error');
      }
  };

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  if (sentOffers.length === 0) {
    return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">No offers sent yet.</Typography>
            <Typography variant="body2" color="text.secondary">Offers you make on jobs will appear here.</Typography>
        </Box>
    );
  }

  return (
    <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Sent Offers</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>Track the status of offers you've made.</Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {sentOffers.map((offer) => (
                <Box key={offer._id}>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Chip 
                                label={offer.status.toUpperCase()} 
                                color={offer.status === 'accepted' ? 'success' : offer.status === 'rejected' ? 'error' : 'warning'} 
                                size="small" 
                                sx={{ fontWeight: 'bold' }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {formatDistanceToNow(new Date(offer.createdAt))} ago
                            </Typography>
                        </Box>

                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            <Link to={`/jobs/${offer.job._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                {offer.job.title}
                            </Link>
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Original Pay: ${offer.job.originalPay}
                        </Typography>

                        <Paper sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, mt: 2 }} elevation={0}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" fontWeight="bold">Current Amount:</Typography>
                                <Typography variant="h6" color="primary.main" fontWeight="bold">${offer.amount}</Typography>
                            </Box>
                            {offer.message && (
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                                    "{offer.message}"
                                </Typography>
                            )}
                        </Paper>

                        <Box sx={{ mt: 2, mb: 1, display: 'flex', gap: 2 }}>
                             <Typography variant="caption" color="text.secondary">Your Counters: {offer.providerCounterCount}/2</Typography>
                             <Typography variant="caption" color="text.secondary">Seeker Counters: {offer.seekerCounterCount}/2</Typography>
                        </Box>

                        {/* Action Buttons for Provider if Seeker Countered */}
                        {(offer.status === 'pending' || offer.status === 'countered') && (
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                                {offer.lastActor === 'seeker' && (
                                    <>
                                        <Button 
                                            variant="contained" 
                                            color="success" 
                                            size="small"
                                            startIcon={<CheckCircleIcon />}
                                            onClick={() => handleAccept(offer._id)}
                                        >
                                            Accept
                                        </Button>
                                        {offer.providerCounterCount < 2 && (
                                            <Button 
                                                variant="outlined" 
                                                color="primary" 
                                                size="small"
                                                onClick={() => { setSelectedNegId(offer._id); setCounterAmount(''); setCounterOpen(true); }}
                                            >
                                                Counter ({offer.providerCounterCount}/2)
                                            </Button>
                                        )}
                                        <Button 
                                            variant="outlined" 
                                            color="error" 
                                            size="small"
                                            onClick={() => handleReject(offer._id)}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}
                            </Box>
                        )}
                    </Paper>
                </Box>
            ))}
        </Box>

        {/* Counter Offer Modal */}
        <Dialog open={counterOpen} onClose={() => setCounterOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold' }}>Counter Offer</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Propose a new price to the seeker.</Typography>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Counter Amount ($)"
                    type="number"
                    fullWidth
                    value={counterAmount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCounterAmount(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    label="Message (Optional)"
                    fullWidth
                    multiline
                    rows={3}
                    value={counterMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCounterMessage(e.target.value)}
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setCounterOpen(false)}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleCounter} disabled={!counterAmount}>
                    Send Counter
                </Button>
            </DialogActions>
        </Dialog>
    </Box>
  );
};

export default SentOffersView;
