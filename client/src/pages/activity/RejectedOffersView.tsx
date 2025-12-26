import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Avatar, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
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
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}



const RejectedOffersView = () => {
  const [rejectedOffers, setRejectedOffers] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    try {
      const data = await offerService.getReceivedOffers();
      setRejectedOffers(data.filter((offer: Negotiation) => offer.status === 'rejected'));
    } catch (error) {
      console.error('Error fetching rejected offers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  if (rejectedOffers.length === 0) {
    return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">No rejected offers.</Typography>
        </Box>
    );
  }

  return (
    <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Rejected Offers</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>History of offers you have declined.</Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {rejectedOffers.map((offer) => (
                <Box key={offer._id}>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, position: 'relative', bgcolor: '#fff5f5' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Chip 
                                label="REJECTED" 
                                color="error" 
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

                        <Paper sx={{ p: 2, bgcolor: '#ffffff', borderRadius: 2, mb: 2 }} elevation={0}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" fontWeight="bold">Offer Amount:</Typography>
                                <Typography variant="h6" color="text.disabled" sx={{ textDecoration: 'line-through' }}>${offer.amount}</Typography>
                            </Box>
                            {offer.message && (
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    "{offer.message}"
                                </Typography>
                            )}
                        </Paper>
                    </Paper>
                </Box>
            ))}
        </Box>
    </Box>
  );
};

export default RejectedOffersView;
