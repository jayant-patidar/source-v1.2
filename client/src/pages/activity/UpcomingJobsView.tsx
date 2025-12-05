import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper, Chip, Stack } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface Job {
  _id: string;
  title: string;
  description: string;
  originalPay: number;
  currentPay?: number;
  jobDate: string;
  location: { general: string };
  status: 'accepted';
  seekerId: { name: string; avatar?: string };
}

const UpcomingJobsView = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/jobs/worked', { withCredentials: true });
        // Filter for accepted jobs (upcoming)
        const upcoming = data.filter((job: Job) => job.status === 'accepted');
        setJobs(upcoming);
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
      <Typography variant="h5" fontWeight="bold" gutterBottom>Upcoming Jobs</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>Jobs you have been accepted for.</Typography>

      {jobs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f9fafb' }} elevation={0}>
          <Typography color="text.secondary">No upcoming jobs found.</Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {jobs.map((job) => (
            <Paper key={job._id} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                      <Typography variant="h6" fontWeight="bold">{job.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Posted by {job.seekerId?.name}
                      </Typography>
                      <Box display="flex" gap={2} mt={1}>
                          <Box display="flex" alignItems="center" gap={0.5}>
                              <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="caption">{format(new Date(job.jobDate), 'MMM d, yyyy')}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                              <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="caption">{job.location.general}</Typography>
                          </Box>
                      </Box>
                  </Box>
                  <Box textAlign="right">
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                          ${job.currentPay || job.originalPay}
                      </Typography>
                      <Chip label="Upcoming" color="primary" size="small" sx={{ mt: 1 }} />
                  </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default UpcomingJobsView;
