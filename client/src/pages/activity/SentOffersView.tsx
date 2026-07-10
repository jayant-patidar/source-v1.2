import { useState, useEffect } from 'react';
import { Box, Typography, Chip, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
    isNegotiable?: boolean;
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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {sentOffers.map((offer) => (
                <Accordion key={offer._id} sx={{ borderRadius: 2, '&:before': { display: 'none' }, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ bgcolor: '#ffffff', '&:hover': { bgcolor: '#f8fafc' }, transition: 'background-color 0.2s' }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2, pr: 1 }}>
                            <Chip 
                                label={offer.status.toUpperCase()} 
                                color={offer.status === 'accepted' ? 'success' : offer.status === 'rejected' ? 'error' : offer.status === 'countered' ? 'secondary' : 'warning'} 
                                size="small" 
                                sx={{ fontWeight: 'bold' }}
                            />
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold', color: '#0f172a' }}>
                                    {offer.job.title}
                                </Typography>
                            </Box>

                            <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                                <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                                    ${offer.amount}
                                </Typography>
                            </Box>
                            
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto', whiteSpace: 'nowrap', display: { xs: 'none', md: 'block' } }}>
                                {formatDistanceToNow(new Date(offer.createdAt))} ago
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    
                    <AccordionDetails sx={{ p: 3, bgcolor: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4 }}>
                            {/* Left Side: Job Info */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, mb: 1, display: 'block' }}>
                                    Job Details
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <Link to={`/jobs/${offer.job._id}`} style={{ textDecoration: 'none', color: '#0f172a' }}>
                                        {offer.job.title}
                                    </Link>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    Original Budget: ${offer.job.originalPay}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    Sent: {formatDistanceToNow(new Date(offer.createdAt))} ago
                                </Typography>
                                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                    <Typography variant="caption" color="text.secondary">Your Counters: {offer.providerCounterCount}/2</Typography>
                                    <Typography variant="caption" color="text.secondary">Seeker Counters: {offer.seekerCounterCount}/2</Typography>
                                </Box>
                            </Box>

                            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                            <Divider sx={{ display: { xs: 'block', sm: 'none' } }} />

                            {/* Right Side: Offer Info */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, mb: 1, display: 'block' }}>
                                    Current Offer
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#0f172a' }}>
                                        ${offer.amount}
                                    </Typography>
                                </Box>
                                {offer.message ? (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', bgcolor: '#f8fafc', p: 1.5, borderRadius: 1, mt: 1 }}>
                                        "{offer.message}"
                                    </Typography>
                                ) : (
                                    <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                                        No message provided.
                                    </Typography>
                                )}

                                {/* Action Buttons for Provider if Seeker Countered */}
                                {(offer.status === 'pending' || offer.status === 'countered') && offer.lastActor === 'seeker' && (
                                    <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                                        <Button 
                                            variant="contained" 
                                            color="success" 
                                            size="small"
                                            startIcon={<CheckCircleIcon />}
                                            onClick={() => handleAccept(offer._id)}
                                        >
                                            Accept
                                        </Button>
                                        {offer.providerCounterCount < 2 && offer.job?.isNegotiable && (
                                            <Button 
                                                variant="outlined" 
                                                color="primary" 
                                                size="small"
                                                onClick={() => { setSelectedNegId(offer._id); setCounterAmount(''); setCounterOpen(true); }}
                                            >
                                                Counter
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
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>
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
