import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, TextField, Paper, Divider, Chip, CircularProgress, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Alert } from '@mui/material';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import SendIcon from '@mui/icons-material/Send';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import LoopIcon from '@mui/icons-material/Loop';
import { format, formatDistanceToNow } from 'date-fns';

// Job interface removed as it was unused

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [negotiationAmount, setNegotiationAmount] = useState('');
  const [message, setMessage] = useState('');
  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerMode, setOfferMode] = useState<'negotiate' | 'interested'>('negotiate');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
      try {
          await axios.post(`http://localhost:5000/api/users/saved/${id}`, {}, { withCredentials: true });
          setIsSaved(!isSaved);
          showToast(isSaved ? "Job Unsaved" : "Job Saved", 'success');
      } catch (error) {
          console.error('Error toggling save:', error);
          showToast('Failed to save job', 'error');
      }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/jobs/${id}`, { withCredentials: true });
        console.log('JobDetails API Fetch Result:', data);
        setJob(data);
        setLoading(false);
        // Check if user is the poster (seekerId)
        if (user && data.seekerId && data.seekerId._id === user._id) {
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
          showToast('Offer sent!', 'success');
          setNegotiationAmount('');
          setMessage('');
          setShowOfferForm(false);
      } catch (err: any) {
          showToast(err.response?.data?.message || 'Failed to send offer', 'error');
      }
  };

  const handleAccept = async (negotiationId: string) => {
      try {
          await axios.put(`http://localhost:5000/api/negotiations/${negotiationId}`, { status: 'accepted' }, { withCredentials: true });
          fetchNegotiations();
          setJob({ ...job, status: 'assigned' });
          showToast('Offer accepted', 'success');
      } catch (err) {
          showToast('Failed to accept', 'error');
      }
  };

  const handleReject = async (negotiationId: string) => {
      try {
          await axios.put(`http://localhost:5000/api/negotiations/${negotiationId}`, { status: 'rejected' }, { withCredentials: true });
          fetchNegotiations();
          showToast('Offer rejected', 'info');
      } catch (err) {
          showToast('Failed to reject', 'error');
      }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Container><Alert severity="error">{error}</Alert></Container>;
  if (!job) return <Container><Typography>Job not found</Typography></Container>;

  // Correctly identify if current user is the poster
  const isPoster = user && job.seekerId && job.seekerId._id === user._id;
  const poster = job.seekerId;
  console.log('JobDetails Render - Job:', job);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      {/* Back Button */}
      <Box sx={{ mb: 2 }}>
        <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ color: 'text.secondary' }}>
          Back to Jobs
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #e0e0e0' }}>
        
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
                <Typography variant="h3" fontWeight="800" sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' }, lineHeight: 1.2, mb: 1 }}>
                {job.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Posted {formatDistanceToNow(new Date(job.createdAt))} ago
                </Typography>
            </Box>
            
            {/* Prominent Pay Display */}
            <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                {job.currentPay && job.currentPay !== job.originalPay ? (
                    <>
                        <Typography variant="h5" sx={{ textDecoration: 'line-through', color: 'text.secondary', mb: 0.5 }}>
                            ${job.originalPay}
                        </Typography>
                        <Typography variant="h4" fontWeight="900" color="success.main">
                            ${job.currentPay}
                        </Typography>
                    </>
                ) : (
                    <Typography variant="h4" fontWeight="900" color="success.main">
                        ${job.originalPay}
                    </Typography>
                )}
                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                    {job.type === 'hourly' ? 'PER HOUR' : 'FIXED PRICE'}
                </Typography>
            </Box>
          </Box>

          {/* Key Info Chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            <Chip 
              icon={<CategoryIcon sx={{ fontSize: 18 }} />}
              label={job.category} 
              sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: '600', fontSize: '0.9rem', py: 0.5 }} 
            />
            <Chip 
              icon={<LocationOnIcon sx={{ fontSize: 18 }} />}
              label={job.location?.general || 'Remote'} 
              sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2', fontWeight: '600', fontSize: '0.9rem', py: 0.5 }} 
            />
             {job.status !== 'open' && (
               <Chip label={job.status.toUpperCase()} color={job.status === 'completed' ? 'success' : 'default'} sx={{ fontWeight: 'bold' }} />
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Description Section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {job.description}
          </Typography>
        </Box>

        {job.requirements && job.requirements.length > 0 && (
            <Box sx={{ mb: 5 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Requirements
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {job.requirements.map((req: string, index: number) => (
                        <Chip
                            key={index}
                            label={req}
                            variant="outlined"
                            sx={{ borderColor: '#bdbdbd', fontWeight: '500' }}
                        />
                    ))}
                </Box>
            </Box>
        )}

        {/* Details Grid */}
        <Box sx={{ mb: 5, bgcolor: '#f9fafb', p: 3, borderRadius: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CalendarTodayIcon sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Date</Typography>
                  <Typography variant="body2" fontWeight="600">
                    {job.jobDate ? format(new Date(job.jobDate), 'MMMM d, yyyy') : 'Flexible'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AccessTimeIcon sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Time</Typography>
                  <Typography variant="body2" fontWeight="600">
                    {job.jobTime || 'Flexible'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={12}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOnIcon sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Location</Typography>
                  <Typography variant="body2" fontWeight="600">
                    {job.location?.general || 'Remote'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    * Exact location provided upon acceptance
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Action Buttons & Interested Button */}
        {!isPoster && user && (
            <Box sx={{ mb: 5 }}>
                {/* Actions Icons Row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }} onClick={() => { setOfferMode('negotiate'); setNegotiationAmount(''); setShowOfferForm(true); }}>
                        <LoopIcon sx={{ fontSize: 28, color: 'black' }} />
                        <Typography variant="caption" sx={{ fontSize: '0.8rem', mt: 0.5, fontWeight: 'bold' }}>Negotiate</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }} onClick={() => alert('Requesting exact location...')}>
                        <ShareLocationIcon sx={{ fontSize: 28, color: 'black' }} />
                        <Typography variant="caption" sx={{ fontSize: '0.8rem', mt: 0.5, fontWeight: 'bold' }}>Locate</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }} onClick={() => alert('Share functionality coming soon!')}>
                        <SendIcon sx={{ fontSize: 28, color: 'black' }} />
                        <Typography variant="caption" sx={{ fontSize: '0.8rem', mt: 0.5, fontWeight: 'bold' }}>Share</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: isSaved ? 1 : 0.7, '&:hover': { opacity: 1 } }} onClick={handleSave}>
                        {isSaved ? <BookmarkIcon sx={{ fontSize: 28, color: 'black' }} /> : <BookmarkBorderIcon sx={{ fontSize: 28, color: 'black' }} />}
                        <Typography variant="caption" sx={{ fontSize: '0.8rem', mt: 0.5, fontWeight: 'bold' }}>{isSaved ? 'Saved' : 'Save'}</Typography>
                    </Box>
                </Box>

                {/* Interested Button */}
                <Button 
                    fullWidth
                    variant="contained" 
                    size="large"
                    onClick={() => { setOfferMode('interested'); setNegotiationAmount(job.originalPay); setShowOfferForm(true); }}
                    sx={{ 
                        bgcolor: 'black', 
                        color: 'white', 
                        fontWeight: 'bold', 
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        '&:hover': { bgcolor: '#333', transform: 'translateY(-2px)' },
                        transition: 'all 0.2s'
                    }}
                >
                    INTERESTED
                </Button>
            </Box>
        )}

        <Divider sx={{ my: 4 }} />

        {/* Seeker Details (Bottom) */}
        <Box sx={{ mb: 4 }}>
             <Typography variant="h6" fontWeight="bold" gutterBottom>
                About the Seeker
            </Typography>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Avatar 
                    src={poster?.avatar} 
                    alt={poster?.name}
                    sx={{ width: 72, height: 72, border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                >
                    {poster?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" component={Link} to={`/profile/${poster?._id}`} sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}>
                        {poster?.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Seeker Rating</Typography>
                            <Typography variant="body2" fontWeight="bold">★ {poster?.seekerRating?.toFixed(1) || 'N/A'}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Provider Rating</Typography>
                            <Typography variant="body2" fontWeight="bold">★ {poster?.providerRating?.toFixed(1) || 'N/A'}</Typography>
                        </Box>
                         <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Member Since</Typography>
                            <Typography variant="body2" fontWeight="bold">{poster?.createdAt ? format(new Date(poster.createdAt), 'MMM yyyy') : 'N/A'}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Button component={Link} to={`/profile/${poster?._id}`} variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                    View Profile
                </Button>
            </Paper>
        </Box>

        {/* Offer Modal */}
        {/* Offer Modal */}
        <Dialog open={showOfferForm} onClose={() => setShowOfferForm(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold' }}>
                {offerMode === 'interested' ? 'Express Interest' : 'Make an Offer'}
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {offerMode === 'interested' 
                        ? `Let ${poster?.name} know you're interested in this job at the listed pay.` 
                        : `Send a proposal to ${poster?.name} with your requested pay.`}
                </Typography>
                
                {offerMode === 'negotiate' ? (
                    <TextField 
                        autoFocus
                        margin="dense"
                        label="Offer Amount ($)" 
                        type="number" 
                        value={negotiationAmount} 
                        onChange={(e) => setNegotiationAmount(e.target.value)} 
                        fullWidth
                        variant="outlined"
                        required
                        sx={{ mb: 2, mt: 1 }}
                    />
                ) : (
                    <Box sx={{ my: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            Proposing to work for: <span style={{ color: '#2e7d32' }}>${job?.originalPay}</span>
                        </Typography>
                    </Box>
                )}

                <TextField 
                    margin="dense"
                    label="Message (Optional)" 
                    multiline 
                    rows={4} 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    fullWidth
                    variant="outlined"
                    placeholder={offerMode === 'interested' ? "I'm available to start immediately..." : "Hi, I can help you with this..."}
                />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={() => setShowOfferForm(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
                <Button 
                    variant="contained" 
                    onClick={handleNegotiate} 
                    disabled={!negotiationAmount}
                    sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: '#333' } }}
                >
                    {offerMode === 'interested' ? 'Send Interest' : 'Send Offer'}
                </Button>
            </DialogActions>
        </Dialog>

        {/* Poster View: Negotiations */}
        {isPoster && (
             <Box sx={{ mt: 6 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">Received Offers</Typography>
                <Divider sx={{ mb: 3 }} />
                {negotiations.length === 0 ? (
                    <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 2, bgcolor: '#f9fafb', borderStyle: 'dashed' }}>
                        <Typography color="text.secondary">No offers received yet.</Typography>
                    </Paper>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {negotiations.map((neg) => (
                            <Paper key={neg._id} elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Typography variant="subtitle1" fontWeight="bold">{neg.provider?.name}</Typography>
                                            <Chip label={`$${neg.amount}`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 'bold' }} />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ bgcolor: '#f5f5f5', p: 1.5, borderRadius: 1, display: 'inline-block' }}>
                                            "{neg.message || 'No message'}"
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                                        <Chip 
                                            label={neg.status.toUpperCase()} 
                                            size="small" 
                                            color={neg.status === 'accepted' ? 'success' : neg.status === 'rejected' ? 'error' : 'default'} 
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                        {neg.status === 'pending' && (
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button variant="contained" size="small" color="success" onClick={() => handleAccept(neg._id)} sx={{ minWidth: 80 }}>
                                                    Accept
                                                </Button>
                                                <Button variant="outlined" size="small" color="error" onClick={() => handleReject(neg._id)} sx={{ minWidth: 80 }}>
                                                    Reject
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                )}
            </Box>
        )}

      </Paper>
    </Container>
  );
};

export default JobDetails;
