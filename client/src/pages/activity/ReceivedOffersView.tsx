import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Avatar, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

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
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

const ReceivedOffersView = () => {
  const [receivedOffers, setReceivedOffers] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/negotiations/received', { withCredentials: true });
      setReceivedOffers(data);
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
        await axios.put(`http://localhost:5000/api/negotiations/${negotiationId}`, { status: 'accepted' }, { withCredentials: true });
        fetchOffers(); // Refresh
    } catch (err) {
        alert('Failed to accept');
    }
  };

  const handleReject = async (negotiationId: string) => {
    try {
        await axios.put(`http://localhost:5000/api/negotiations/${negotiationId}`, { status: 'rejected' }, { withCredentials: true });
        fetchOffers(); // Refresh
    } catch (err) {
        alert('Failed to reject');
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
        <Typography variant="body2" color="text.secondary" paragraph>Offers from providers for your posted jobs.</Typography>
        
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
                                <Typography variant="subtitle1" fontWeight="bold">{offer.provider.name}</Typography>
                                <Typography variant="caption">★ {offer.provider.providerRating?.toFixed(1) || 'N/A'} Provider Rating</Typography>
                            </Box>
                        </Box>

                        <Paper sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, mb: 2 }} elevation={0}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" fontWeight="bold">Offer Amount:</Typography>
                                <Typography variant="h6" color="success.main" fontWeight="bold">${offer.amount}</Typography>
                            </Box>
                            {offer.message && (
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    "{offer.message}"
                                </Typography>
                            )}
                        </Paper>

                        {offer.status === 'pending' && (
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
                                >
                                    Accept
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </Box>
            ))}
        </Box>
    </Box>
  );
};

export default ReceivedOffersView;
