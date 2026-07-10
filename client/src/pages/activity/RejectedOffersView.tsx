import { useState, useEffect } from 'react';
import { Box, Typography, Chip, Avatar, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {rejectedOffers.map((offer) => (
                <Accordion key={offer._id} sx={{ borderRadius: 2, '&:before': { display: 'none' }, border: '1px solid #fee2e2', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ bgcolor: '#fff5f5', '&:hover': { bgcolor: '#ffe4e6' }, transition: 'background-color 0.2s' }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2, pr: 2 }}>
                            <Chip label="REJECTED" color="error" size="small" sx={{ fontWeight: 'bold' }} />
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                                <Avatar src={offer.provider.avatar} alt={offer.provider.name} sx={{ width: 32, height: 32 }} />
                                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold', color: '#0f172a' }}>
                                    {offer.provider.name}
                                </Typography>
                            </Box>

                            <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#64748b', textDecoration: 'line-through' }}>
                                    ${offer.amount}
                                </Typography>
                            </Box>
                            
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto', whiteSpace: 'nowrap' }}>
                                {formatDistanceToNow(new Date(offer.createdAt))} ago
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 3, bgcolor: '#ffffff' }}>
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
                                <Typography variant="body2" color="text.secondary">
                                    Original Budget: ${offer.job.originalPay}
                                </Typography>
                            </Box>

                            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                            <Divider sx={{ display: { xs: 'block', sm: 'none' } }} />

                            {/* Right Side: Offer Info */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, mb: 1, display: 'block' }}>
                                    Provider Proposal
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#0f172a' }}>
                                        ${offer.amount}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#ef4444', bgcolor: '#fef2f2', px: 1, py: 0.5, borderRadius: 1, fontWeight: 'bold' }}>
                                        DECLINED
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
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    </Box>
  );
};

export default RejectedOffersView;
