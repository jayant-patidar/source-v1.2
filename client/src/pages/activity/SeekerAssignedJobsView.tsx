import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper, Chip, Button, Stack } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';

interface Job {
  _id: string;
  title: string;
  originalPay: number;
  currentPay?: number;
  jobDate: string;
  status: 'accepted';
  providerId?: { name: string; avatar?: string };
}

const SeekerAssignedJobsView = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/jobs/poster', { withCredentials: true });
        console.log('SeekerAssignedJobsView - All Posted Jobs:', data);
        const assigned = data.filter((job: Job) => job.status === 'accepted');
        console.log('SeekerAssignedJobsView - Filtered Assigned Jobs:', assigned);
        setJobs(assigned);
      } catch (error) {
        console.error('Failed to fetch jobs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleStartJob = async (jobId: string) => {
      try {
          await axios.put(`http://localhost:5000/api/jobs/${jobId}`, { status: 'in_progress' }, { withCredentials: true });
          // Refresh list
          setJobs(prev => prev.filter(j => j._id !== jobId));
      } catch (error) {
          console.error('Failed to start job', error);
      }
  };

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>Assigned Jobs</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>Jobs you assigned to a provider. Mark them as "In Progress" when they start.</Typography>

      {jobs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f9fafb' }} elevation={0}>
          <Typography color="text.secondary">No assigned jobs pending start.</Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {jobs.map((job) => (
            <Paper key={job._id} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                      <Typography variant="h6" fontWeight="bold">{job.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                          Provider: {job.providerId?.name || 'Assigned'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                          Scheduled: {format(new Date(job.jobDate), 'MMM d, yyyy')}
                      </Typography>
                  </Box>
                  <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                      <Chip label="Ready to Start" color="info" size="small" />
                      <Button variant="contained" size="small" onClick={() => handleStartJob(job._id)} sx={{ bgcolor: 'black' }}>
                          Start Job
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

export default SeekerAssignedJobsView;
