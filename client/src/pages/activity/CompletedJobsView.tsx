import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, CircularProgress, Paper, Chip, Button, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { jobService } from '../../services/job.service';
import { formatLocalDate } from '../../utils/dateUtils';
import PaymentIcon from '@mui/icons-material/Payment';
import DescriptionIcon from '@mui/icons-material/Description';
import ReplayIcon from '@mui/icons-material/Replay';

interface Job {
  _id: string;
  title: string;
  originalPay: number;
  currentPay?: number;
  jobDate: string;
  status: 'completed';
  seekerId: { name: string; _id: string };
  providerId?: { name: string; _id: string };
  paymentStatus?: 'pending' | 'paid' | 'failed';
}

interface CompletedJobsViewProps {
  role: 'seeker' | 'provider';
}

const CompletedJobsView = ({ role }: CompletedJobsViewProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      try {
        let data = [];
        if (role === 'seeker') {
           data = await jobService.getPostedJobs();
        } else {
           data = await jobService.getWorkedJobs();
        }
        // Filter for completed jobs
        const completed = data.filter((job: Job) => job.status === 'completed');
        setJobs(completed);
      } catch (error) {
        console.error('Failed to fetch completed jobs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedJobs();
  }, [role]);

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>Completed Jobs ({role === 'seeker' ? 'Posted' : 'Worked'})</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>History of jobs that have been finished.</Typography>

      {jobs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f9fafb' }} elevation={0}>
          <Typography color="text.secondary">No completed jobs yet.</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {jobs.map((job) => (
            <Accordion key={job._id} sx={{ borderRadius: 2, '&:before': { display: 'none' }, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ bgcolor: '#ffffff', '&:hover': { bgcolor: '#f8fafc' }, transition: 'background-color 0.2s' }}
              >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2, pr: 1 }}>
                      <Chip label="COMPLETED" size="small" color="success" sx={{ fontWeight: 'bold' }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold', color: '#0f172a' }}>
                              {job.title}
                          </Typography>
                      </Box>

                      <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                          {job.currentPay && job.currentPay !== job.originalPay ? (
                              <Box component="span">
                                  <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary', mr: 1 }}>
                                      ${job.originalPay}
                                  </Typography>
                                  <Typography variant="subtitle2" component="span" fontWeight="bold" color="success.main">
                                      ${job.currentPay}
                                  </Typography>
                              </Box>
                          ) : (
                              <Typography variant="subtitle2" fontWeight="bold" color="success.main">
                                  ${job.originalPay}
                              </Typography>
                          )}
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto', whiteSpace: 'nowrap', display: { xs: 'none', md: 'block' } }}>
                          {formatLocalDate(job.jobDate, 'MMM d, yyyy')}
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
                              <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none', color: '#0f172a' }}>
                                  {job.title}
                              </Link>
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              {role === 'seeker' ? (
                                  <>Provider: <Link to={`/profile/${job.providerId?._id}`} style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 'bold' }}>{job.providerId?.name || 'Unknown'}</Link></>
                              ) : (
                                  <>Client: <Link to={`/profile/${job.seekerId?._id}`} style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 'bold' }}>{job.seekerId?.name || 'Unknown'}</Link></>
                              )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                              Completed: {formatLocalDate(job.jobDate, 'MMM d, yyyy')}
                          </Typography>
                      </Box>

                      <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                      <Divider sx={{ display: { xs: 'block', sm: 'none' } }} />

                      {/* Right Side: Actions */}
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5, display: 'block' }}>
                              Quick Actions
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {role === 'seeker' && job.paymentStatus === 'pending' ? (
                                <Button 
                                  variant="contained" 
                                  color="primary" 
                                  size="small" 
                                  startIcon={<PaymentIcon />}
                                  onClick={() => navigate(`/payment/${job._id}`)}
                                  sx={{ bgcolor: '#0f172a', '&:hover': { bgcolor: '#334155' } }}
                                >
                                  Pay Now
                                </Button>
                              ) : (
                                <Chip 
                                  label={job.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'} 
                                  color={job.paymentStatus === 'paid' ? 'success' : 'warning'} 
                                  size="small" 
                                  variant={job.paymentStatus === 'paid' ? 'outlined' : 'filled'} 
                                  sx={{ my: 'auto', fontWeight: 'bold' }} 
                                />
                              )}
                              
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<DescriptionIcon />}
                                onClick={() => navigate(`/contract/${job._id}`)}
                                sx={{ color: '#475569', borderColor: '#cbd5e1' }}
                              >
                                Contract
                              </Button>
                              
                              {role === 'seeker' && (
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<ReplayIcon />}
                                    onClick={() => navigate('/post-job', { state: { repostJob: job } })}
                                    sx={{ color: '#4f46e5', borderColor: 'rgba(79, 70, 229, 0.5)', '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.04)' } }}
                                  >
                                    Repost
                                  </Button>
                              )}
                          </Box>
                      </Box>
                  </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CompletedJobsView;
