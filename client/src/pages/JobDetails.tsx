import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, TextField, Paper, Divider, Chip, CircularProgress, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Alert } from '@mui/material';
import { offerService } from '../services/offer.service';
import { jobService } from '../services/job.service';
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
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { format, formatDistanceToNow } from 'date-fns';
import { formatLocalDate } from '../utils/dateUtils';
import { useTransactionStore } from '../store/transactionStore';

// Job interface removed as it was unused

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showToast } = useToastStore();

  // Guard: show login prompt if user is not authenticated
  const requireAuth = (action: () => void) => {
    if (!user) {
      showToast('Please login', 'warning');
      return;
    }
    action();
  };
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [negotiationAmount, setNegotiationAmount] = useState('');
  const [message, setMessage] = useState('');
  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerMode, setOfferMode] = useState<'negotiate' | 'interested'>('negotiate');
  const [isSaved, setIsSaved] = useState(false);
  const [counterOpen, setCounterOpen] = useState(false);
  const [selectedNegId, setSelectedNegId] = useState('');
  const [counterAmount, setCounterAmount] = useState('');
  const [counterMessage, setCounterMessage] = useState('');
  
  const { transferCoins, isLoading: txLoading } = useTransactionStore();

  const handleTransfer = async () => {
    try {
      if (!job.providerId) return;
      await transferCoins(job._id, job.providerId._id || job.providerId, job.currentPay || job.originalPay);
      showToast('SourceCoins transferred successfully!', 'success');
      // Update local job state
      setJob({ ...job, paymentStatus: 'paid' });
    } catch (err: any) {
      showToast(err.message || 'Failed to transfer coins', 'error');
    }
  };

  const handleSave = async () => {
      try {
          await jobService.toggleSaveJob(id!);
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
        if (!id) return;
        const data = await jobService.getJob(id);
        // console.log('JobDetails API Fetch Result:', data);
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


// ...

  const fetchNegotiations = async () => {
      try {
          const data = await offerService.getOffersByJob(id!);
          setNegotiations(data);
      } catch (err) {
          console.error(err);
      }
  };

  const handleNegotiate = async () => {
      try {
          await offerService.createOffer({
              jobId: id!,
              amount: Number(negotiationAmount),
              message
          });
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
          await offerService.updateOfferStatus(negotiationId, 'accepted');
          fetchNegotiations();
          setJob({ ...job, status: 'accepted' });
          showToast('Offer accepted', 'success');
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
          fetchNegotiations();
      } catch (err: any) {
          showToast(err.response?.data?.message || 'Failed to send counter', 'error');
      }
  };

  const handleReject = async (negotiationId: string) => {
      try {
          await offerService.updateOfferStatus(negotiationId, 'rejected');
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
  const isPoster = user && (job.seekerId === user._id || (job.seekerId && job.seekerId._id === user._id));
  const poster = job.seekerId;

  const handleRepost = () => {
    navigate('/post-job', { state: { repostJob: job } });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Back Button */}
      <Box sx={{ mb: 2 }}>
        <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ color: 'text.secondary', fontWeight: 700 }}>
          Back to Jobs
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: 4, 
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
            bgcolor: '#ffffff',
            position: 'relative',
            overflow: 'hidden'
          }}>
        
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: { xs: 'wrap', md: 'nowrap' }, gap: 2 }}>
            <Box sx={{ flex: 1 }}>
                <Typography variant="h3" fontWeight="900" sx={{ 
                  fontSize: { xs: '1.75rem', md: '2.5rem' }, 
                  lineHeight: 1.2, 
                  mb: 1,
                  letterSpacing: '-1px'
                }}>
                {job.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: '#94a3b8', fontWeight: 600 }}>
                    Posted {formatDistanceToNow(new Date(job.createdAt))} ago
                </Typography>
            </Box>
            
            {/* Prominent Pay Display */}
            <Box sx={{ textAlign: { xs: 'left', md: 'right' }, minWidth: 120 }}>
                {job.currentPay && job.currentPay !== job.originalPay ? (
                    <>
                        <Typography variant="h5" sx={{ textDecoration: 'line-through', color: '#94a3b8', mb: 0.5, fontWeight: 700 }}>
                            ${job.originalPay}
                        </Typography>
                        <Box sx={{ display: 'inline-block', bgcolor: 'rgba(16, 185, 129, 0.1)', px: 2, py: 1, borderRadius: 2 }}>
                            <Typography variant="h4" fontWeight="900" sx={{ color: '#10b981' }}>
                                ${job.currentPay}
                            </Typography>
                        </Box>
                    </>
                ) : (
                    <Box sx={{ display: 'inline-block', bgcolor: 'rgba(16, 185, 129, 0.1)', px: 2, py: 1, borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight="900" sx={{ color: '#10b981' }}>
                            ${job.originalPay}
                        </Typography>
                    </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1, mt: 1 }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, letterSpacing: '0.5px' }}>
                        {job.type === 'hourly' ? 'PER HOUR' : 'FIXED PRICE'}
                    </Typography>
                    {job.isNegotiable === false && (
                        <Chip 
                            label="Non-Negotiable" 
                            size="small"
                            sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontWeight: 800, borderRadius: 1.5, height: 20, fontSize: '0.65rem' }} 
                        />
                    )}
                </Box>
                {isPoster && job.status === 'completed' && job.paymentMethod === 'sourcecoin' && job.paymentStatus !== 'paid' && (
                    <Button
                      variant="contained"
                      startIcon={<AccountBalanceWalletIcon />}
                      onClick={handleTransfer}
                      disabled={txLoading}
                      sx={{ 
                        mt: 2, 
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
                        color: 'white', 
                        fontWeight: 700,
                        borderRadius: 2,
                        textTransform: 'none',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.3)' } 
                      }}
                    >
                      {txLoading ? <CircularProgress size={24} color="inherit" /> : 'Transfer SourceCoins'}
                    </Button>
                )}
                {job.paymentStatus === 'paid' && (
                  <Chip label="PAID" size="small" sx={{ mt: 2, fontWeight: 800, bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#059669', borderRadius: 1.5 }} />
                )}
            </Box>
          </Box>

          {/* Key Info Chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            <Chip 
              icon={<CategoryIcon sx={{ fontSize: 18, color: '#6366f1 !important' }} />}
              label={job.category} 
              sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', fontWeight: '800', fontSize: '0.85rem', py: 0.5, borderRadius: 2 }} 
            />
            <Chip 
              icon={<LocationOnIcon sx={{ fontSize: 18, color: '#a855f7 !important' }} />}
              label={job.location?.general || 'Remote'} 
              sx={{ bgcolor: 'rgba(168, 85, 247, 0.1)', color: '#9333ea', fontWeight: '800', fontSize: '0.85rem', py: 0.5, borderRadius: 2 }} 
            />
             {job.status !== 'open' && (
               <Chip label={job.status.toUpperCase()} sx={{ fontWeight: '800', borderRadius: 2, bgcolor: job.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)', color: job.status === 'completed' ? '#059669' : '#475569' }} />
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
                <Typography variant="h6" fontWeight="900" sx={{ letterSpacing: '-0.5px' }} gutterBottom>
                    Requirements
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
                    {job.requirements.map((req: string, index: number) => (
                        <Chip
                            key={index}
                            label={req}
                            sx={{ 
                                bgcolor: 'rgba(99, 102, 241, 0.1)', 
                                color: '#4f46e5', 
                                fontWeight: '800', 
                                borderRadius: 2,
                                px: 1,
                                py: 2
                            }}
                        />
                    ))}
                </Box>
            </Box>
        )}

        {/* Details Grid */}
        <Box sx={{ mb: 2, p: 1 }}>
          <Grid container spacing={2} alignItems="stretch">
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, height: '100%', boxSizing: 'border-box', transition: 'all 0.2s', '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' } }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5' }}>
                  <CalendarTodayIcon />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 0.5 }}>DATE</Typography>
                  <Typography variant="body1" fontWeight="800" sx={{ color: '#0f172a' }}>
                    {job.jobDate ? formatLocalDate(job.jobDate, 'MMM d, yyyy') : 'Flexible'}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, height: '100%', boxSizing: 'border-box', transition: 'all 0.2s', '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' } }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(236, 72, 153, 0.1)', color: '#db2777' }}>
                  <AccessTimeIcon />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 0.5 }}>TIME</Typography>
                  <Typography variant="body1" fontWeight="800" sx={{ color: '#0f172a' }}>
                    {job.jobTime || 'Flexible'}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, height: '100%', boxSizing: 'border-box', transition: 'all 0.2s', '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' } }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                  <AccountBalanceWalletIcon />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 0.5 }}>PAYMENT METHOD</Typography>
                  <Typography variant="body1" fontWeight="800" textTransform="capitalize" sx={{ color: '#0f172a' }}>
                    {job.paymentMethod || 'cash'}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
               <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, height: '100%', boxSizing: 'border-box', transition: 'all 0.2s', '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' } }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }}>
                  <LocationOnIcon />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 0.5 }}>LOCATION</Typography>
                  <Typography variant="body1" fontWeight="800" sx={{ color: '#0f172a' }}>
                    {job.location?.general || 'Remote'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic', display: 'block' }}>
                    * Exact location provided upon acceptance
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
          </Paper>

          {/* Poster View: Negotiations */}
          {isPoster && (
              <Box sx={{ mt: 6, mb: 4 }}>
                  <Typography variant="h5" gutterBottom fontWeight="900" sx={{ letterSpacing: '-0.5px' }}>Received Offers</Typography>
                  <Divider sx={{ mb: 4 }} />
                  {negotiations.length === 0 ? (
                      <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: '#f8fafc', borderStyle: 'dashed', borderColor: '#cbd5e1' }}>
                          <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 800 }}>No offers received yet.</Typography>
                      </Paper>
                  ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          {negotiations.map((neg) => {
                              const canCounter = neg.lastActor === 'provider' && neg.status !== 'accepted' && neg.status !== 'rejected' && neg.seekerCounterCount < 2 && job?.isNegotiable;
                              const canAccept = neg.lastActor === 'provider' && neg.status !== 'accepted' && neg.status !== 'rejected';
                              
                              return (
                                  <Paper key={neg._id} elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 4, transition: 'all 0.2s', '&:hover': { borderColor: '#cbd5e1', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' } }}>
                                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                                          <Box sx={{ flexGrow: 1 }}>
                                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                  <Typography variant="h6" fontWeight="900">{neg.provider?.name}</Typography>
                                                  <Chip label={`$${neg.amount}`} size="medium" sx={{ fontWeight: '900', bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontSize: '1rem' }} />
                                                  <Chip 
                                                      label={neg.status === 'countered' ? 'COUNTER OFFER' : neg.status.toUpperCase()} 
                                                      size="small" 
                                                      sx={{ 
                                                        fontWeight: '800', 
                                                        bgcolor: neg.status === 'accepted' ? 'rgba(16, 185, 129, 0.1)' : neg.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                        color: neg.status === 'accepted' ? '#059669' : neg.status === 'rejected' ? '#dc2626' : '#d97706',
                                                      }}
                                                  />
                                              </Box>
                                              
                                              <Box sx={{ bgcolor: '#f8fafc', p: 3, borderRadius: 3, mb: 3 }}>
                                                  <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#475569', mb: neg.offerHistory?.length > 1 ? 3 : 0 }}>
                                                      "{neg.message || 'No message'}"
                                                  </Typography>
                                                  {neg.offerHistory && neg.offerHistory.length > 1 && (
                                                      <Box sx={{ pl: 3, borderLeft: '3px solid #e2e8f0' }}>
                                                          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px', display: 'block', mb: 2 }}>OFFER HISTORY</Typography>
                                                          {neg.offerHistory.slice(0, -1).reverse().map((h: any, idx: number) => (
                                                              <Box key={idx} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                  <Typography variant="body2" sx={{ color: h.actor === 'seeker' ? '#6366f1' : '#10b981', fontWeight: 800 }}>
                                                                      {h.actor === 'seeker' ? 'You' : neg.provider?.name}: ${h.amount}
                                                                  </Typography>
                                                                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                                      • {format(new Date(h.timestamp), 'MMM d, h:mm a')}
                                                                  </Typography>
                                                              </Box>
                                                          ))}
                                                      </Box>
                                                  )}
                                              </Box>
                                              
                                              <Box display="flex" gap={3}>
                                                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                                      Your Counters: <span style={{ fontWeight: 900, color: '#0f172a' }}>{neg.seekerCounterCount}/2</span>
                                                  </Typography>
                                                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                                      Provider Counters: <span style={{ fontWeight: 900, color: '#0f172a' }}>{neg.providerCounterCount}/2</span>
                                                  </Typography>
                                              </Box>
                                          </Box>
  
                                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1.5, minWidth: 140 }}>
                                              {(canAccept || canCounter) && (
                                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
                                                      {canAccept && (
                                                          <Button variant="contained" onClick={() => handleAccept(neg._id)} fullWidth sx={{ bgcolor: '#10b981', color: 'white', fontWeight: 800, '&:hover': { bgcolor: '#059669' }, borderRadius: 2 }}>
                                                              Accept Offer
                                                          </Button>
                                                      )}
                                                      {canCounter && (
                                                          <Button variant="outlined" onClick={() => { setSelectedNegId(neg._id); setCounterAmount(''); setCounterOpen(true); }} fullWidth sx={{ color: '#6366f1', borderColor: '#6366f1', fontWeight: 800, borderRadius: 2 }}>
                                                              Counter ({neg.seekerCounterCount}/2)
                                                          </Button>
                                                      )}
                                                      <Button variant="text" onClick={() => handleReject(neg._id)} fullWidth sx={{ color: '#ef4444', fontWeight: 800, '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' }, borderRadius: 2 }}>
                                                          Reject
                                                      </Button>
                                                  </Box>
                                              )}
                                          </Box>
                                      </Box>
                                  </Paper>
                              );
                          })}
                      </Box>
                  )}
              </Box>
          )}
        </Grid>

        {/* Right Column (Sticky Sidebar) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Action Buttons & Interested Button */}
            {!isPoster && (
                <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#ffffff', borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                    {/* Actions Icons Row */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, mb: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', group: 'true' }} onClick={() => requireAuth(() => { 
                          if (job.isNegotiable === false) {
                            showToast('This job is non-negotiable. You can only express interest at the listed price.', 'warning');
                            return;
                          }
                          setOfferMode('negotiate'); setNegotiationAmount(''); setShowOfferForm(true); 
                        })}>
                            <Box sx={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'white', border: '1px solid #f1f5f9', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)', transform: 'translateY(-2px)', borderColor: 'transparent' } }}>
                              <LoopIcon sx={{ fontSize: 20, color: '#4f46e5' }} />
                            </Box>
                            <Typography variant="caption" sx={{ fontSize: '0.75rem', mt: 1, fontWeight: '800', color: '#64748b' }}>Negotiate</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => requireAuth(() => showToast('Requesting exact location...', 'info'))}>
                            <Box sx={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'white', border: '1px solid #f1f5f9', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.1)', transform: 'translateY(-2px)', borderColor: 'transparent' } }}>
                              <ShareLocationIcon sx={{ fontSize: 20, color: '#059669' }} />
                            </Box>
                            <Typography variant="caption" sx={{ fontSize: '0.75rem', mt: 1, fontWeight: '800', color: '#64748b' }}>Locate</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => requireAuth(() => showToast('Share functionality coming soon!', 'info'))}>
                            <Box sx={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'white', border: '1px solid #f1f5f9', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(236, 72, 153, 0.1)', transform: 'translateY(-2px)', borderColor: 'transparent' } }}>
                              <SendIcon sx={{ fontSize: 20, color: '#db2777' }} />
                            </Box>
                            <Typography variant="caption" sx={{ fontSize: '0.75rem', mt: 1, fontWeight: '800', color: '#64748b' }}>Share</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => requireAuth(handleSave)}>
                            <Box sx={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: isSaved ? 'rgba(245, 158, 11, 0.15)' : 'white', border: isSaved ? 'transparent' : '1px solid #f1f5f9', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.1)', transform: 'translateY(-2px)', borderColor: 'transparent' } }}>
                              {isSaved ? <BookmarkIcon sx={{ fontSize: 20, color: '#d97706' }} /> : <BookmarkBorderIcon sx={{ fontSize: 20, color: '#d97706' }} />}
                            </Box>
                            <Typography variant="caption" sx={{ fontSize: '0.75rem', mt: 1, fontWeight: '800', color: isSaved ? '#d97706' : '#64748b' }}>{isSaved ? 'Saved' : 'Save'}</Typography>
                        </Box>
                    </Box>

                    {/* Interested Button */}
                    <Button 
                        fullWidth
                        variant="contained" 
                        size="large"
                        onClick={() => requireAuth(() => { setOfferMode('interested'); setNegotiationAmount(job.originalPay); setShowOfferForm(true); })}
                        sx={{ 
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                            color: 'white', 
                            fontWeight: '900', 
                            py: 1.5,
                            borderRadius: 3,
                            fontSize: '1.1rem',
                            letterSpacing: '0.5px',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                            '&:hover': { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', transform: 'translateY(-2px)', boxShadow: '0 12px 25px rgba(0,0,0,0.3)' },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        INTERESTED
                    </Button>
                </Box>
            )}

            {isPoster && job.status !== 'open' && (
                <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#ffffff', mb: 1, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                    <Typography variant="h6" fontWeight="900" sx={{ mb: 2, letterSpacing: '-0.5px' }}>
                        Need this done again?
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                        You can quickly repost this job. We'll copy all the details over for you.
                    </Typography>
                    <Button 
                        fullWidth
                        variant="contained" 
                        size="large"
                        onClick={handleRepost}
                        sx={{ 
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            color: 'white', 
                            fontWeight: '900', 
                            py: 1.5,
                            borderRadius: 3,
                            fontSize: '1rem',
                            letterSpacing: '0.5px',
                            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 25px rgba(99, 102, 241, 0.4)' },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        REPOST JOB
                    </Button>
                </Box>
            )}

            {/* Seeker Details (Sidebar) */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, bgcolor: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                 <Typography variant="subtitle2" fontWeight="900" sx={{ letterSpacing: '0.5px', color: '#64748b', width: '100%', textAlign: 'left' }}>
                    ABOUT THE SEEKER
                </Typography>
                <Box sx={{ p: 0.5, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>
                  <Avatar 
                      src={poster?.avatar} 
                      alt={poster?.name}
                      sx={{ width: 80, height: 80, border: '4px solid #fff' }}
                  >
                      {poster?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <Typography variant="h6" fontWeight="900" component={Link} to={`/profile/${poster?._id}`} sx={{ textDecoration: 'none', color: '#0f172a', '&:hover': { color: '#6366f1' }, transition: 'color 0.2s', mb: 2 }}>
                        {poster?.name}
                    </Typography>
                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', mb: 2, bgcolor: '#f8fafc', p: 1.5, borderRadius: 2 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, display: 'block' }}>SEEKER</Typography>
                            <Typography variant="body2" fontWeight="900" sx={{ color: '#0f172a' }}>★ {poster?.seekerRating?.toFixed(1) || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, display: 'block' }}>PROVIDER</Typography>
                            <Typography variant="body2" fontWeight="900" sx={{ color: '#0f172a' }}>★ {poster?.providerRating?.toFixed(1) || 'N/A'}</Typography>
                        </Box>
                    </Box>
                     <Box sx={{ width: '100%', textAlign: 'center', mb: 2 }}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, display: 'block' }}>MEMBER SINCE</Typography>
                        <Typography variant="body2" fontWeight="800" sx={{ color: '#0f172a' }}>{poster?.createdAt ? format(new Date(poster.createdAt), 'MMM yyyy') : 'N/A'}</Typography>
                    </Box>
                    <Button component={Link} to={`/profile/${poster?._id}`} variant="outlined" fullWidth sx={{ borderRadius: 3, fontWeight: 800, color: '#0f172a', borderColor: '#cbd5e1', '&:hover': { borderColor: '#94a3b8', bgcolor: '#f1f5f9' } }}>
                        View Profile
                    </Button>
                </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Offer Modal */}
        <Dialog open={showOfferForm} onClose={() => setShowOfferForm(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
            <DialogTitle sx={{ fontWeight: '900', fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
                {offerMode === 'interested' ? 'Express Interest' : 'Make an Offer'}
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
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
                        sx={{ mb: 3 }}
                    />
                ) : (
                    <Box sx={{ mb: 3, p: 2.5, bgcolor: 'rgba(16, 185, 129, 0.1)', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="subtitle1" fontWeight="800" sx={{ color: '#0f172a' }}>
                            Proposing to work for:
                        </Typography>
                        <Typography variant="h5" fontWeight="900" sx={{ color: '#10b981' }}>
                            ${job?.originalPay}
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
                <Button onClick={() => setShowOfferForm(false)} sx={{ color: '#64748b', fontWeight: 800 }}>Cancel</Button>
                <Button 
                    variant="contained" 
                    onClick={handleNegotiate} 
                    disabled={!negotiationAmount}
                    sx={{ 
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
                        color: 'white', 
                        fontWeight: 800,
                        px: 4,
                        borderRadius: 2,
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.3)' },
                        '&.Mui-disabled': { background: '#e2e8f0', color: '#94a3b8' }
                    }}
                >
                    {offerMode === 'interested' ? 'Send Interest' : 'Send Offer'}
                </Button>
            </DialogActions>
        </Dialog>

        {/* Counter Offer Modal */}
        <Dialog open={counterOpen} onClose={() => setCounterOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
            <DialogTitle sx={{ fontWeight: '900', fontSize: '1.5rem', letterSpacing: '-0.5px' }}>Make a Counter Offer</DialogTitle>
            <DialogContent>
                <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
                    Enter a new amount you'd like to propose.
                </Typography>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Counter Amount ($)"
                    type="number"
                    fullWidth
                    value={counterAmount}
                    onChange={(e) => setCounterAmount(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 3 }}
                />
                <TextField
                    margin="dense"
                    label="Message (Optional)"
                    placeholder="I can offer this amount instead..."
                    fullWidth
                    multiline
                    rows={3}
                    value={counterMessage}
                    onChange={(e) => setCounterMessage(e.target.value)}
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setCounterOpen(false)} sx={{ color: '#64748b', fontWeight: 800 }}>Cancel</Button>
                <Button 
                    variant="contained" 
                    onClick={handleCounter} 
                    disabled={!counterAmount}
                    sx={{ 
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                        color: 'white', 
                        fontWeight: 800,
                        px: 4,
                        borderRadius: 2,
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(99, 102, 241, 0.3)' },
                        '&.Mui-disabled': { background: '#e2e8f0', color: '#94a3b8' }
                    }}
                >
                    Send Counter
                </Button>
            </DialogActions>
        </Dialog>
    </Container>
  );
};

export default JobDetails;
