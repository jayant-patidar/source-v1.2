import { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab, Chip, Button, Divider, Grid, Avatar, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import JobCard from '../components/JobCard';
import SavedJobCard from '../components/SavedJobCard';

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

const ActivityPage = () => {
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [receivedOffers, setReceivedOffers] = useState<Negotiation[]>([]);
  const [sentOffers, setSentOffers] = useState<Negotiation[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [receivedRes, sentRes, savedRes] = await Promise.all([
          axios.get('http://localhost:5000/api/negotiations/received', { withCredentials: true }),
          axios.get('http://localhost:5000/api/negotiations/my-offers', { withCredentials: true }),
          axios.get('http://localhost:5000/api/users/saved', { withCredentials: true })
        ]);
        setReceivedOffers(receivedRes.data);
        setSentOffers(sentRes.data);
        setSavedJobs(savedRes.data);
      } catch (error) {
        console.error('Error fetching activity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAccept = async (negotiationId: string) => {
      try {
          await axios.put(`http://localhost:5000/api/negotiations/${negotiationId}`, { status: 'accepted' }, { withCredentials: true });
          // Refresh data
          const receivedRes = await axios.get('http://localhost:5000/api/negotiations/received', { withCredentials: true });
          setReceivedOffers(receivedRes.data);
      } catch (err) {
          alert('Failed to accept');
      }
  };

  const handleReject = async (negotiationId: string) => {
      try {
          await axios.put(`http://localhost:5000/api/negotiations/${negotiationId}`, { status: 'rejected' }, { withCredentials: true });
          // Refresh data
          const receivedRes = await axios.get('http://localhost:5000/api/negotiations/received', { withCredentials: true });
          setReceivedOffers(receivedRes.data);
      } catch (err) {
          alert('Failed to reject');
      }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" fontWeight="900" gutterBottom>
        My Activity
      </Typography>
      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, overflow: 'hidden' }}>
        <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{ borderBottom: '1px solid #e0e0e0', bgcolor: '#f9fafb' }}
        >
          <Tab label="Received (Seeker)" sx={{ fontWeight: 'bold', py: 3 }} />
          <Tab label="Sent (Provider)" sx={{ fontWeight: 'bold', py: 3 }} />
          <Tab label="Saved Jobs" sx={{ fontWeight: 'bold', py: 3 }} />
        </Tabs>

        {/* Seeker View: Received Offers */}
        <Box role="tabpanel" hidden={tabValue !== 0} sx={{ p: 3 }}>
            {tabValue === 0 && (
                receivedOffers.length === 0 ? (
                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>No offers received yet.</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {receivedOffers.map((offer) => (
                            <Grid item xs={12} md={6} key={offer._id}>
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
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button 
                                                variant="contained" 
                                                fullWidth 
                                                color="success" 
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => handleAccept(offer._id)}
                                            >
                                                Accept
                                            </Button>
                                            <Button 
                                                variant="outlined" 
                                                fullWidth 
                                                color="error" 
                                                startIcon={<CancelIcon />}
                                                onClick={() => handleReject(offer._id)}
                                            >
                                                Reject
                                            </Button>
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )
            )}
        </Box>

        {/* Provider View: Sent Offers */}
        <Box role="tabpanel" hidden={tabValue !== 1} sx={{ p: 3 }}>
            {tabValue === 1 && (
                sentOffers.length === 0 ? (
                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>No offers sent yet.</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {sentOffers.map((offer) => (
                            <Grid item xs={12} md={6} key={offer._id}>
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
                            </Grid>
                        ))}
                    </Grid>
                )
            )}
        </Box>

        {/* Saved Jobs View */}
        <Box role="tabpanel" hidden={tabValue !== 2} sx={{ p: 3 }}>
            {tabValue === 2 && (
                savedJobs.length === 0 ? (
                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>No saved jobs yet.</Typography>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {savedJobs.map((job) => (
                            <Box key={job._id} sx={{ width: '100%' }}>
                                <SavedJobCard 
                                    job={job} 
                                    onUnsave={(jobId) => setSavedJobs(prev => prev.filter(j => j._id !== jobId))} 
                                />
                            </Box>
                        ))}
                    </Box>
                )
            )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ActivityPage;
