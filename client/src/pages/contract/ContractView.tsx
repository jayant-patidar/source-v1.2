import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Divider, CircularProgress, Chip, Stepper, Step, StepLabel, StepContent, Button, Avatar, Card, CardContent } from '@mui/material';

import { format } from 'date-fns';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useAuthStore } from '../../store/authStore';
import ReviewModal from '@/components/reviews/ReviewModal';
import { Rating } from '@mui/material';
import { useToastStore } from '../../store/toastStore';

import { jobService } from '../../services/job.service';
import { offerService } from '../../services/offer.service';
import { transactionService } from '../../services/transaction.service';
import { reviewService } from '../../services/review.service';

// ... (keep interfaces)
interface TimelineEvent {
  status: string;
  timestamp: string;
  actorId?: string;
  details?: string;
  _id?: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Job {
  _id: string;
  title: string;
  description: string;
  originalPay: number;
  currentPay?: number;
  seekerId: UserProfile;
  providerId?: UserProfile;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  jobDate: string;
  jobTime: string;
  location: { general: string; exact: string };
  category: string;
  requirements: string[];
  timeline?: TimelineEvent[];
}

interface Negotiation {
  _id: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  seeker: any;
  provider: any;
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

interface Transaction {
  _id: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  reviewer: { _id: string; name: string; avatar?: string };
  reviewee: { _id: string; name: string; avatar?: string };
  createdAt: string;
}


const ContractView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  
  const [job, setJob] = useState<Job | null>(null);
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const [jobData, negData, transData, reviewData] = await Promise.all([
          jobService.getJob(id),
          offerService.getOffersByJob(id),
          transactionService.getTransactionsByJob(id),
          reviewService.getReviewsByJob(id)
        ]);
        setJob(jobData);
        setNegotiations(negData);
        setTransactions(transData);
        setReviews(reviewData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Box display="flex" justifyContent="center" height="100vh" alignItems="center"><CircularProgress /></Box>;
  if (!job) return <Box p={4}><Typography color="error">Contract not found</Typography></Box>;

  // Sort timeline by date
  const timeline = job.timeline ? [...job.timeline].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) : [];

  const getStepLabel = (status: string) => {
    switch (status) {
      case 'created': return 'Job Created';
      case 'accepted': return 'Offer Accepted';
      case 'started': return 'Work Started';
      case 'paused': return 'Work Paused';
      case 'in_progress': return 'Work Resumed';
      case 'pending_completion': return 'Completion Requested';
      case 'completed': return 'Job Finished';
      case 'paid': return 'Payment Processed';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getStepDescription = (event: TimelineEvent) => {
    return (
      <>
        {event.details && (
          <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
            {event.details}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary">
          {format(new Date(event.timestamp), 'PPP p')}
        </Typography>
      </>
    );
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
      if (!job || !user) return;
      setSubmittingReview(true);
      try {
          await reviewService.createReview({
              job: job._id,
              rating,
              comment
          });
          

          // Reload reviews to get full populated data
          const reviewData = await reviewService.getReviewsByJob(id!);
          setReviews(reviewData);

          showToast('Review submitted successfully!', 'success');
          setReviewModalOpen(false);
          
      } catch (error: any) {
          showToast(error.response?.data?.message || 'Failed to submit review', 'error');
      } finally {
          setSubmittingReview(false);
      }
  };

  const canReview = job && user && job.status === 'completed' && job.paymentStatus === 'paid' && 
                    !reviews.some(r => r.reviewer._id === user._id) &&
                    (job.seekerId._id === user._id || job.providerId?._id === user._id);
  
  const revieweeName = job && user ? (job.seekerId._id === user._id ? job.providerId?.name : job.seekerId.name) : '';

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
      {job && revieweeName && (
        <ReviewModal 
            open={reviewModalOpen} 
            onClose={() => setReviewModalOpen(false)} 
            onSubmit={handleReviewSubmit}
            revieweeName={revieweeName || 'User'}
            submitting={submittingReview}
        />
      )}
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center" gap={2}>
           <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} color="inherit">Back</Button>
           <Divider orientation="vertical" flexItem />
           <DescriptionIcon fontSize="large" color="primary" />
           <Box>
               <Typography variant="h5" fontWeight="bold">Contract #{job._id.slice(-6).toUpperCase()}</Typography>
               <Typography variant="caption" color="text.secondary">ID: {job._id}</Typography>
           </Box>
        </Box>
        <Box display="flex" gap={1}>
             <Chip 
                label={job.status.toUpperCase().replace('_', ' ')} 
                color={job.status === 'completed' ? 'success' : 'primary'} 
                variant={job.status === 'completed' ? 'filled' : 'outlined'}
            />
             <Chip 
                label={job.paymentStatus.toUpperCase()} 
                color={job.paymentStatus === 'paid' ? 'success' : 'warning'} 
                variant="filled"
            />
            {canReview && (
                <Button 
                    variant="contained" 
                    color="secondary" 
                    startIcon={<RateReviewIcon />}
                    onClick={() => setReviewModalOpen(true)}
                    sx={{ ml: 2 }}
                >
                    Rate User
                </Button>
            )}
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Contract Details & History */}
        <Grid size={{ xs: 12, md: 8 }}>
           
           {/* Section 1: Executive Summary */}
           <Grid container spacing={2} mb={4}>
              <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                      <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>ORIGINAL PAY</Typography>
                      <Typography variant="h5" fontWeight="bold">${job.originalPay}</Typography>
                  </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
                      <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>AGREED PAY</Typography>
                      <Typography variant="h5" fontWeight="bold">${job.currentPay || job.originalPay}</Typography>
                  </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: job.paymentStatus === 'paid' ? 'success.main' : 'warning.main', color: 'white' }}>
                      <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>TOTAL PAID</Typography>
                      <Typography variant="h5" fontWeight="bold">${transactions.reduce((acc, t) => acc + t.amount, 0)}</Typography>
                  </Paper>
              </Grid>
           </Grid>

           {/* Section 2: Job Details */}
           <Paper sx={{ p: 3, mb: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                      <BusinessIcon color="action" /> Job Details
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Created: {format(new Date(job.createdAt), 'PPP')}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle2" color="text.secondary">TITLE</Typography>
                      <Typography variant="body1" fontWeight="medium">{job.title}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle2" color="text.secondary">DESCRIPTION</Typography>
                      <Typography variant="body2">{job.description}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                      <Typography variant="subtitle2" color="text.secondary">CATEGORY</Typography>
                      <Chip label={job.category} size="small" />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                      <Typography variant="subtitle2" color="text.secondary">DATE & TIME</Typography>
                      <Typography variant="body2">{format(new Date(job.jobDate), 'PPP')} at {job.jobTime}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography variant="subtitle2" color="text.secondary">LOCATION</Typography>
                      <Typography variant="body2">{job.location.exact}</Typography>
                  </Grid>
                   <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle2" color="text.secondary">REQUIREMENTS</Typography>
                      <Box display="flex" gap={1} flexWrap="wrap" mt={0.5}>
                          {job.requirements.map(req => <Chip key={req} label={req} size="small" variant="outlined" />)}
                      </Box>
                  </Grid>
              </Grid>
           </Paper>

            {/* Section 3: Negotiation History */}
           {negotiations.length > 0 && (
               <Paper sx={{ p: 3, mb: 4 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
                      <AttachMoneyIcon color="action" /> Negotiation History
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {negotiations.map((neg, idx) => (
                      <Box key={neg._id} mb={3}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>NEGOTIATION #{idx + 1}</Typography>
                          {neg.offerHistory && neg.offerHistory.length > 0 ? (
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                  {neg.offerHistory.map((h, hIdx) => (
                                      <Box 
                                          key={hIdx} 
                                          p={2} 
                                          borderRadius={2} 
                                          bgcolor={h.actor === 'seeker' ? '#f0f7ff' : '#f6ffed'} 
                                          borderLeft={`4px solid ${h.actor === 'seeker' ? '#1976d2' : '#52c41a'}`}
                                      >
                                          <Box display="flex" justifyContent="space-between" alignItems="center">
                                              <Box display="flex" alignItems="center" gap={1}>
                                                  <Typography variant="body2" fontWeight="bold" color={h.actor === 'seeker' ? 'primary.main' : 'success.main'}>
                                                      {h.actor === 'seeker' ? 'SEEKER' : 'PROVIDER'} OFFER
                                                  </Typography>
                                                  <Chip label={`$${h.amount}`} size="small" variant="filled" />
                                              </Box>
                                              <Typography variant="caption" color="text.secondary">
                                                  {format(new Date(h.timestamp), 'MMM d, h:mm a')}
                                              </Typography>
                                          </Box>
                                          {h.message && (
                                              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                                                  "{h.message}"
                                              </Typography>
                                          )}
                                      </Box>
                                  ))}
                                  {neg.status === 'accepted' && (
                                      <Box p={2} borderRadius={2} bgcolor="#e6fffa" border="1px solid #38b2ac" textAlign="center">
                                          <Typography variant="body2" fontWeight="bold" color="#2c7a7b">
                                              ✓ FINAL AGREEMENT REACHED
                                          </Typography>
                                      </Box>
                                  )}
                                  {neg.status === 'rejected' && (
                                      <Box p={2} borderRadius={2} bgcolor="#fff5f5" border="1px solid #feb2b2" textAlign="center">
                                          <Typography variant="body2" fontWeight="bold" color="#c53030">
                                              ✕ NEGOTIATION CLOSED (REJECTED)
                                          </Typography>
                                      </Box>
                                  )}
                              </Box>
                          ) : (
                              <Box p={2} borderRadius={1} bgcolor="#f9fafb" borderLeft={`4px solid ${neg.status === 'accepted' ? '#2e7d32' : neg.status === 'rejected' ? '#d32f2f' : '#ed6c02'}`}>
                                  <Box display="flex" justifyContent="space-between">
                                     <Typography fontWeight="bold">Initial Offer</Typography>
                                     <Chip label={neg.status.toUpperCase()} size="small" color={neg.status === 'accepted' ? 'success' : neg.status === 'rejected' ? 'error' : 'warning'} />
                                  </Box>
                                  <Typography variant="body2" mt={0.5}>Amount: <strong>${neg.amount}</strong></Typography>
                                  <Typography variant="caption" color="text.secondary">Sent on {format(new Date(neg.createdAt), 'PPP p')}</Typography>
                              </Box>
                          )}
                      </Box>
                  ))}
                  <Box mt={2} p={2} bgcolor="#e8f5e9" borderRadius={1}>
                      <Typography variant="subtitle2" color="success.main">FINAL AGREED OFFER</Typography>
                      <Typography variant="h6" fontWeight="bold">${job.currentPay || job.originalPay}</Typography>
                  </Box>
               </Paper>
           )}

           {/* Section 5: Reviews */}
           {reviews.length > 0 && (
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
                      <StarIcon color="warning" /> Reviews
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {reviews.map((review) => (
                        <Box key={review._id} mb={2} p={2} bgcolor="#f9fafb" borderRadius={1}>
                             <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Avatar sx={{ width: 24, height: 24 }}>{review.reviewer.name.charAt(0)}</Avatar>
                                    <Typography variant="subtitle2" fontWeight="bold">{review.reviewer.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">reviewed</Typography>
                                    <Typography variant="subtitle2" fontWeight="bold">{review.reviewee.name}</Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">{format(new Date(review.createdAt), 'PPP')}</Typography>
                             </Box>
                             <Rating value={review.rating} readOnly size="small" precision={0.5} />
                             <Typography variant="body2" mt={1}>{review.comment}</Typography>
                             {/* Display Reply if exists */}
                             { (review as any).response && (
                                 <Box mt={2} ml={2} p={2} bgcolor="#eeeeee" borderRadius={1}>
                                     <Typography variant="caption" fontWeight="bold" color="text.secondary">Response:</Typography>
                                     <Typography variant="body2" mt={0.5}>{(review as any).response.message}</Typography>
                                 </Box>
                             )}
                        </Box>
                    ))}
                </Paper>
           )}

           {/* Section 4: Activity Lifecycle */}
           <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
                  <AccessTimeIcon color="action" /> Activity Lifecycle
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {timeline.length === 0 ? (
                  <Typography color="text.secondary">No history events recorded.</Typography>
              ) : (
                  <Stepper orientation="vertical" activeStep={timeline.length}>
                      {timeline.map((event, index) => (
                        <Step key={index} active={true} completed={true} expanded>
                          <StepLabel icon={<CheckCircleIcon color="success" />}>
                            <Typography fontWeight="bold">{getStepLabel(event.status)}</Typography>
                          </StepLabel>
                          <StepContent>
                             <Typography variant="body2" color="text.secondary">{getStepDescription(event)}</Typography>
                          </StepContent>
                        </Step>
                      ))}
                  </Stepper>
              )}
           </Paper>
        </Grid>

        {/* Right Column: Parties & Payments */}
        <Grid size={{ xs: 12, md: 4 }}>
           {/* Parties */}
           <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
                  <PersonIcon color="action" /> Parties
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box mb={3}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>CLIENT (SEEKER)</Typography>
                  <Card variant="outlined">
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                          <Avatar sx={{ width: 48, height: 48 }}>{job.seekerId.name.charAt(0)}</Avatar>
                          <Box>
                              <Typography fontWeight="bold">{job.seekerId.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{job.seekerId.email}</Typography>
                          </Box>
                      </CardContent>
                  </Card>
              </Box>

              <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>PROVIDER</Typography>
                  {job.providerId ? (
                      <Card variant="outlined">
                          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                              <Avatar sx={{ width: 48, height: 48, bgcolor: 'secondary.main' }}>{job.providerId.name.charAt(0)}</Avatar>
                              <Box>
                                  <Typography fontWeight="bold">{job.providerId.name}</Typography>
                                  <Typography variant="caption" color="text.secondary">{job.providerId.email}</Typography>
                              </Box>
                          </CardContent>
                      </Card>
                  ) : (
                      <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5', textAlign: 'center' }}>
                          <Typography color="text.secondary">Pending Assignment</Typography>
                      </Paper>
                  )}
              </Box>
           </Paper>

           {/* Payment Record */}
           <Paper sx={{ p: 3 }}>
               <Typography variant="h6" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
                  <AttachMoneyIcon color="action" /> Payment Record
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {transactions.length > 0 ? (
                  transactions.map(t => (
                      <Box key={t._id} mb={2}>
                          <Grid container justifyContent="space-between">
                              <Typography variant="subtitle2" color="text.secondary">Amount</Typography>
                              <Typography fontWeight="bold" color="success.main">${t.amount}</Typography>
                          </Grid>
                          <Grid container justifyContent="space-between" mt={1}>
                              <Typography variant="subtitle2" color="text.secondary">Method</Typography>
                              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{t.paymentMethod.replace('_', ' ')}</Typography>
                          </Grid>
                          <Grid container justifyContent="space-between" mt={1}>
                              <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                              <Typography variant="body2">{format(new Date(t.createdAt), 'MMM d, yyyy')}</Typography>
                          </Grid>
                           <Grid container justifyContent="space-between" mt={1}>
                              <Typography variant="subtitle2" color="text.secondary">Tx ID</Typography>
                              <Typography variant="caption" fontFamily="monospace">{t._id}</Typography>
                          </Grid>
                          <Divider sx={{ mt: 2 }} />
                      </Box>
                  ))
              ) : (
                  <Box textAlign="center" py={2}>
                      <Typography color="text.secondary">No payments recorded.</Typography>
                      {job.paymentStatus === 'pending' && job.status === 'completed' && (
                          <Chip label="Payment Pending" color="warning" size="small" sx={{ mt: 1 }} />
                      )}
                  </Box>
              )}
           </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContractView;
