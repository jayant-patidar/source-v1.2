import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Avatar, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useToastStore } from '../../store/toastStore';
import { offerService } from '../../services/offer.service';

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

const ReceivedOffersView = () => {
  const [receivedOffers, setReceivedOffers] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);
  const [counterOpen, setCounterOpen] = useState(false);
  const [selectedNegId, setSelectedNegId] = useState('');
  const [counterAmount, setCounterAmount] = useState('');
  const [counterMessage, setCounterMessage] = useState('');
  const { showToast } = useToastStore();

  const fetchOffers = async () => {
    try {
      const data = await offerService.getReceivedOffers();
      // Show both pending and countered offers
      setReceivedOffers(data.filter((offer: Negotiation) => offer.status === 'pending' || offer.status === 'countered'));
    } catch (error) {
      console.error('Error fetching received offers:', error);
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
        fetchOffers(); // Refresh
    } catch (err) {
        showToast('Failed to accept', 'error');
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

  const handleReject = async (negotiationId: string) => {
    try {
        await offerService.updateOfferStatus(negotiationId, 'rejected');
        showToast('Offer rejected', 'info');
        fetchOffers(); // Refresh
    } catch (err) {
        showToast('Failed to reject', 'error');
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  if (receivedOffers.length === 0) {
    return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">No offers received yet.</Typography>
            <Typography variant="body2" color="text.secondary">When providers make offers on your jobs, they will appear here.</Typography>
        </Box>
    );
  }

  return (
    <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Received Offers</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>Pending offers from providers for your posted jobs.</Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {receivedOffers.map((offer) => (
                <Box key={offer._id}>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, position: 'relative' }}>
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
                        
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Job: <Link to={`/jobs/${offer.job._id}`} style={{ color: 'inherit', fontWeight: 'bold' }}>{offer.job.title}</Link>
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
                            <Avatar src={offer.provider.avatar} alt={offer.provider.name} />
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    <Link to={`/profile/${offer.provider._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {offer.provider.name}
                                    </Link>
                                </Typography>
                                <Typography variant="caption">★ {offer.provider.providerRating?.toFixed(1) || 'N/A'} Provider Rating</Typography>
                            </Box>
                        </Box>

                        <Paper sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, mb: 2 }} elevation={0}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" fontWeight="bold">Current Amount:</Typography>
                                <Typography variant="h6" color="success.main" fontWeight="bold">${offer.amount}</Typography>
                            </Box>
                            {offer.message && (
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 1 }}>
                                    "{offer.message}"
                                </Typography>
                            )}
                            {offer.offerHistory && offer.offerHistory.length > 1 && (
                                <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed #ddd' }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">Round: {offer.seekerCounterCount + offer.providerCounterCount} of 4</Typography>
                                </Box>
                            )}
                        </Paper>

                        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                             <Typography variant="caption" color="text.secondary">Your Counters: {offer.seekerCounterCount}/2</Typography>
                             <Typography variant="caption" color="text.secondary">Provider Counters: {offer.providerCounterCount}/2</Typography>
                        </Box>

                        {(offer.status === 'pending' || offer.status === 'countered') && (
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <Button 
                                    variant="outlined" 
                                    color="error" 
                                    startIcon={<CancelIcon />}
                                    onClick={() => handleReject(offer._id)}
                                >
                                    Reject
                                </Button>
                                    <Button 
                                        variant="contained" 
                                        color="success" 
                                        startIcon={<CheckCircleIcon />}
                                        onClick={() => handleAccept(offer._id)}
                                        disabled={offer.lastActor === 'seeker'}
                                    >
                                        Accept
                                    </Button>
                                    {offer.seekerCounterCount < 2 && offer.lastActor === 'provider' && (
                                        <Button 
                                            variant="outlined" 
                                            color="primary" 
                                            onClick={() => { setSelectedNegId(offer._id); setCounterAmount(''); setCounterOpen(true); }}
                                        >
                                            Counter ({offer.seekerCounterCount}/2)
                                        </Button>
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
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}> Propose a new price for this job. </Typography>
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

export default ReceivedOffersView;
