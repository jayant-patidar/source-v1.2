import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper, Chip, Stack } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';

interface Job {
  _id: string;
  title: string;
  originalPay: number;
  currentPay?: number;
  jobDate: string;
  status: 'completed';
  seekerId: { name: string };
}

const CompletedJobsView = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/jobs/provider', { withCredentials: true });
        const completed = data.filter((job: Job) => job.status === 'completed');
        setJobs(completed);
      } catch (error) {
        console.error('Failed to fetch jobs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>Completed Jobs</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>History of jobs you have finished.</Typography>

      {jobs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f9fafb' }} elevation={0}>
          <Typography color="text.secondary">No completed jobs yet.</Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {jobs.map((job) => (
            <Paper key={job._id} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, opacity: 0.8 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                      <Typography variant="h6" fontWeight="bold">{job.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                          Completed on {format(new Date(job.jobDate), 'MMM d, yyyy')}
                      </Typography>
                  </Box>
                  <Box textAlign="right">
                      <Typography variant="h6" color="success.main" fontWeight="bold">
                          +${job.currentPay || job.originalPay}
                      </Typography>
                      <Chip label="Paid" color="success" size="small" variant="outlined" />
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
