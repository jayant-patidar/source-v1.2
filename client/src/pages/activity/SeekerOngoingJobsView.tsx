import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper, Chip, Button, Stack } from '@mui/material';
import axios from 'axios';

interface Job {
  _id: string;
  title: string;
  originalPay: number;
  currentPay?: number;
  jobDate: string;
  status: 'in_progress';
  providerId?: { name: string };
}

const SeekerOngoingJobsView = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/jobs/poster', { withCredentials: true });
        const ongoing = data.filter((job: Job) => job.status === 'in_progress');
        setJobs(ongoing);
      } catch (error) {
        console.error('Failed to fetch jobs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleCompleteJob = async (jobId: string) => {
      try {
          await axios.put(`http://localhost:5000/api/jobs/${jobId}`, { status: 'completed' }, { withCredentials: true });
          setJobs(prev => prev.filter(j => j._id !== jobId));
      } catch (error) {
          console.error('Failed to complete job', error);
      }
  };

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>Ongoing Jobs</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>Jobs currently in progress. Mark as completed when done.</Typography>

      {jobs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f9fafb' }} elevation={0}>
          <Typography color="text.secondary">No jobs currently in progress.</Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {jobs.map((job) => (
            <Paper key={job._id} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, borderLeft: '4px solid #1976d2' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                      <Typography variant="h6" fontWeight="bold">{job.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                          Provider: {job.providerId?.name} is working...
                      </Typography>
                  </Box>
                  <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                      <Chip label="In Progress" color="primary" size="small" />
                      <Button variant="contained" color="success" size="small" onClick={() => handleCompleteJob(job._id)}>
                          Mark Completed
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

export default SeekerOngoingJobsView;
