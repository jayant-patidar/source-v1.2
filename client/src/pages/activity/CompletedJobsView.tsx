import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, CircularProgress, Paper, Chip, Stack, Button } from '@mui/material';
import { jobService } from '../../services/job.service';
import { format } from 'date-fns';
import PaymentIcon from '@mui/icons-material/Payment';
import DescriptionIcon from '@mui/icons-material/Description';

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
        <Stack spacing={2}>
          {jobs.map((job) => (
            <Paper key={job._id} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, opacity: 0.9 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                      <Typography variant="h6" fontWeight="bold">
                          <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                              {job.title}
                          </Link>
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {role === 'seeker' ? (
                              <>
                                  Provider: <Link to={`/profile/${job.providerId?._id}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>{job.providerId?.name || 'Unknown'}</Link>
                              </>
                          ) : (
                              <>
                                  Client: <Link to={`/profile/${job.seekerId?._id}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>{job.seekerId?.name || 'Unknown'}</Link>
                              </>
                          )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                          Completed on {format(new Date(job.jobDate), 'MMM d, yyyy')}
                      </Typography>
                  </Box>
                  <Box textAlign="right">
                      <Typography variant="h6" color="success.main" fontWeight="bold">
                          {role === 'seeker' ? '-' : '+'}${job.currentPay || job.originalPay}
                      </Typography>
                      {role === 'seeker' && job.paymentStatus === 'pending' ? (
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="small" 
                          startIcon={<PaymentIcon />}
                          sx={{ mt: 1 }}
                          onClick={() => navigate(`/payment/${job._id}`)}
                        >
                          Pay Now
                        </Button>
                      ) : (
                        <Chip 
                          label={job.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'} 
                          color={job.paymentStatus === 'paid' ? 'success' : 'warning'} 
                          size="small" 
                          variant={job.paymentStatus === 'paid' ? 'outlined' : 'filled'} 
                          sx={{ mt: 0.5 }} 
                        />
                      )}
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<DescriptionIcon />}
                        onClick={() => navigate(`/contract/${job._id}`)}
                        sx={{ display: 'block', ml: 'auto', mt: 1 }}
                      >
                        View Contract
                      </Button>
                  </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default CompletedJobsView;
