import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, TextField, Paper, Divider, Chip, CircularProgress, Alert, Avatar, IconButton } from '@mui/material';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { format } from 'date-fns';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [negotiationAmount, setNegotiationAmount] = useState('');
  const [message, setMessage] = useState('');
  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/jobs/${id}`, { withCredentials: true });
        setJob(data);
        setLoading(false);
        if (user && data.poster && data.poster._id === user._id) {
            fetchNegotiations();
        }
      } catch (err) {
        setError('Failed to load job details');
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, user]);

  const fetchNegotiations = async () => {
      try {
          const { data } = await axios.get(`http://localhost:5000/api/negotiations/${id}`, { withCredentials: true });
          setNegotiations(data);
      } catch (err) {
          console.error(err);
      }
  };

  const handleNegotiate = async () => {
      try {
          await axios.post('http://localhost:5000/api/negotiations', {
              jobId: id,
              amount: Number(negotiationAmount),
              message
          }, { withCredentials: true });
          alert('Offer sent!');
          setNegotiationAmount('');
          setMessage('');
      } catch (err: any) {
          alert(err.response?.data?.message || 'Failed to send offer');
      }
  };

  const handleAccept = async (negotiationId: string) => {
      try {
          await axios.put(`http://localhost:5000/api/negotiations/${negotiationId}`, { status: 'accepted' }, { withCredentials: true });
          fetchNegotiations();
          setJob({ ...job, status: 'assigned' });
      } catch (err) {
          alert('Failed to accept');
      }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Container><Alert severity="error">{error}</Alert></Container>;
  if (!job) return <Container><Typography>Job not found</Typography></Container>;

  const isPoster = user && job.poster && job.poster._id === user._id;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: '1px solid #e2e8f0' }}>
        {/* Back Button */}
        <IconButton component={Link} to="/" sx={{ mb: 2, color: 'black' }}>
          <ArrowBackIcon />
        </IconButton>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h4" fontWeight="900" sx={{ fontSize: '2rem', flexGrow: 1, mr: 2 }}>
            {job.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
             <Chip 
              label={`Pay: $${job.pay}`} 
              sx={{ 
                bgcolor: '#000000', 
                color: 'white', 
                fontWeight: 'bold', 
                borderRadius: '16px',
                height: 32
              }} 
            />
            <Chip 
              label={job.payType === 'hourly' ? 'Hourly' : 'One-Time'} 
              sx={{ 
                bgcolor: '#e0f2f1', 
                color: '#00695c', 
                fontWeight: 'bold', 
                borderRadius: '16px',
                height: 32
              }} 
            />
          </Box>
        </Box>

        {/* Category Tag */}
        <Chip 
          label={`Category: ${job.category}`} 
          sx={{ 
            bgcolor: '#e8eaf6', 
            color: '#3f51b5', 
            fontWeight: 'bold', 
            borderRadius: '8px',
            mb: 4
          }} 
        />

        {/* Description */}
        <Typography variant="body1" paragraph sx={{ mb: 4, color: '#444', fontSize: '1.1rem', lineHeight: 1.6 }}>
          {job.description}
        </Typography>

        {/* Job Details Grid */}
        <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                <Typography variant="body2" sx={{ minWidth: 100, color: '#666' }}>Date:</Typography>
                <Typography variant="body1" fontWeight="500">
                    {job.jobDate ? format(new Date(job.jobDate), 'MMMM d, yyyy') : 'Flexible'}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                <Typography variant="body2" sx={{ minWidth: 100, color: '#666' }}>Time:</Typography>
                <Typography variant="body1" fontWeight="500">{job.jobTime || 'Flexible'}</Typography>
            </Box>
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                <Typography variant="body2" sx={{ minWidth: 100, color: '#666' }}>Prerequisite:</Typography>
                <Typography variant="body1" fontWeight="500">None</Typography>
            </Box>
        </Box>

        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', color: '#555', mb: 6 }}>
            <LocationOnIcon sx={{ mr: 1, color: '#3f51b5' }} />
            <Typography variant="body1">{job.location?.address || job.location?.general || 'Location not specified'}</Typography>
        </Box>

        {/* Action Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6, p: 2, bgcolor: '#fafafa', borderRadius: 2 }}>
             <Box sx={{ display: 'flex', gap: 6, px: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }}>
                  <Typography variant="h5">↻</Typography>
                  <Typography variant="caption">Negotiate</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }}>
                  <Typography variant="h5">⌖</Typography>
                  <Typography variant="caption">Locate</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }}>
                   <Typography variant="h5">➤</Typography>
                  <Typography variant="caption">Share</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }}>
                   <Typography variant="h5">🔖</Typography>
                  <Typography variant="caption">Save</Typography>
                </Box>
            </Box>

            <Button 
                variant="contained" 
                fullWidth
                sx={{ 
                  bgcolor: '#000000', 
                  color: 'white', 
                  fontWeight: 'bold',
                  py: 1.5,
                  borderRadius: 1,
                  maxWidth: 400,
                  '&:hover': { bgcolor: '#333' }
                }}
            >
                INTERESTED
            </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Job Poster Section */}
        <Typography variant="h6" gutterBottom>Job Poster:</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar 
                src={job.poster?.avatar} 
                alt={job.poster?.name}
                sx={{ width: 80, height: 80, border: '1px solid #eee' }}
            >
                {job.poster?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
                <Typography variant="h6" fontWeight="bold" component={Link} to={`/profile/${job.poster?._id}`} sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}>
                    {job.poster?.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">Seeker Rating: {job.poster?.seekerRating || 'N/A'} ★</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">Provider Rating: {job.poster?.providerRating || 'N/A'} ★</Typography>
                </Box>
                 <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    User Since: {job.poster?.createdAt ? format(new Date(job.poster.createdAt), 'MMMM d, yyyy') : 'Recently'}
                </Typography>
            </Box>
        </Box>

        {/* Negotiation Section (Existing Logic kept for functionality) */}
        {isPoster && (
             <Box sx={{ mt: 6, p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">Offers & Negotiations</Typography>
                {negotiations.length === 0 ? <Typography color="text.secondary">No offers received yet.</Typography> : (
                    negotiations.map((neg) => (
                        <Paper key={neg._id} variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'white' }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">{neg.seeker?.name} offered ${neg.amount}</Typography>
                                    <Typography variant="body2" color="text.secondary">{neg.message}</Typography>
                                </Box>
                                <Box>
                                    {neg.status === 'pending' && (
                                        <Button variant="contained" size="small" onClick={() => handleAccept(neg._id)} sx={{ bgcolor: 'black' }}>Accept</Button>
                                    )}
                                    <Chip label={neg.status} size="small" sx={{ ml: 1 }} color={neg.status === 'accepted' ? 'success' : 'default'} />
                                </Box>
                            </Box>
                        </Paper>
                    ))
                )}
            </Box>
        )}

        {!isPoster && user && (
             <Box sx={{ mt: 6 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">Make an Offer</Typography>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 500 }}>
                    <TextField 
                        label="Offer Amount ($)" 
                        type="number" 
                        value={negotiationAmount} 
                        onChange={(e) => setNegotiationAmount(e.target.value)} 
                        fullWidth
                        size="small"
                    />
                    <TextField 
                        label="Message (Optional)" 
                        multiline 
                        rows={3} 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        fullWidth
                        size="small"
                    />
                    <Button 
                        variant="contained" 
                        onClick={handleNegotiate} 
                        disabled={!negotiationAmount}
                        sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: '#333' } }}
                    >
                        Send Offer
                    </Button>
                </Box>
            </Box>
        )}
      </Paper>
    </Container>
  );
};

export default JobDetails;
