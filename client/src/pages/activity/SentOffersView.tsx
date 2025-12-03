import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
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

const SentOffersView = () => {
  const [sentOffers, setSentOffers] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/negotiations/my-offers', { withCredentials: true });
        setSentOffers(data);
      } catch (error) {
        console.error('Error fetching sent offers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

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
                                <Typography variant="body2" fontWeight="bold">My Offer:</Typography>
                                <Typography variant="h6" color="primary.main" fontWeight="bold">${offer.amount}</Typography>
                            </Box>
                        </Paper>
                    </Paper>
                </Box>
            ))}
        </Box>
    </Box>
  );
};

export default SentOffersView;
