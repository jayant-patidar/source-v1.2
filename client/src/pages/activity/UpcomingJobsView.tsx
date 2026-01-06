import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper, Chip, Stack, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/job.service';
import { format } from 'date-fns';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useToastStore } from '../../store/toastStore';

interface Job {
  _id: string;
  title: string;
  description: string;
  originalPay: number;
  currentPay?: number;
  jobDate: string;
  jobTime: string;
  location: { general: string };
  status: 'accepted' | 'pending_start_approval';
  seekerId: { name: string; avatar?: string; _id: string };
}

const UpcomingJobsView = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEarlyStart, setIsEarlyStart] = useState(false);
  const { showToast } = useToastStore();

  const fetchJobs = async () => {
    try {
      const data = await jobService.getWorkedJobs();
      // Filter for accepted or pending start approval jobs (upcoming)
      const upcoming = data.filter((job: Job) => job.status === 'accepted' || job.status === 'pending_start_approval');
      setJobs(upcoming);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleStartClick = (job: Job) => {
    setSelectedJob(job);
    const jobDateTime = new Date(job.jobDate);
    // Combine date and time
    const [hours, minutes] = job.jobTime.split(':').map(Number);
    jobDateTime.setHours(hours || 0, minutes || 0);

    const now = new Date();
    if (now < jobDateTime) {
        setIsEarlyStart(true);
    } else {
        setIsEarlyStart(false);
    }
    setOpenDialog(true);
  };

  const handleConfirmStart = async () => {
    if (!selectedJob) return;
    try {
        await jobService.startJob(selectedJob._id);
        showToast('Job started successfully!', 'success');
        fetchJobs(); // Refresh list
        setOpenDialog(false);
    } catch (error) {
        showToast('Failed to start job', 'error');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedJob(null);
  };

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>Upcoming Jobs</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>Jobs you have been accepted for. Ready to start?</Typography>

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
                      <Typography variant="h6" fontWeight="bold">
                          <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                              {job.title}
                          </Link>
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Posted by <Link to={`/profile/${job.seekerId?._id}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>{job.seekerId?.name}</Link>
                      </Typography>
                      <Box display="flex" gap={2} mt={1}>
                          <Box display="flex" alignItems="center" gap={0.5}>
                              <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="caption">{format(new Date(job.jobDate), 'MMM d, yyyy')} at {job.jobTime}</Typography>
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
                      <Chip 
                        label={job.status === 'pending_start_approval' ? "Pending Approval" : "Upcoming"} 
                        color={job.status === 'pending_start_approval' ? "warning" : "info"} 
                        size="small" 
                        sx={{ mt: 1, mb: 1, display: 'block' }} 
                      />
                      <Button 
                        variant="contained" 
                        size="small" 
                        color="primary" 
                        startIcon={<PlayArrowIcon />}
                        onClick={() => handleStartClick(job)}
                        disabled={job.status === 'pending_start_approval'}
                      >
                        {job.status === 'pending_start_approval' ? "Waiting..." : "Start Job"}
                      </Button>
                  </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>
            {isEarlyStart ? "Start Job Early?" : "Start Job Now?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isEarlyStart 
                ? "This job is scheduled for a later time. Starting it now will notify the seeker. Are you sure you want to proceed?" 
                : "Are you ready to begin this job? This will change the status to 'In Progress'."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmStart} autoFocus variant="contained" color={isEarlyStart ? "warning" : "primary"}>
            Confirm Start
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpcomingJobsView;
