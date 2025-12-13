import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper, Chip, Button, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useToastStore } from '../../store/toastStore';

interface Job {
  _id: string;
  title: string;
  originalPay: number;
  currentPay?: number;
  jobDate: string;
  jobTime: string;
  location: { general: string };
  status: 'in_progress' | 'paused' | 'pending_completion';
  seekerId: { name: string; avatar?: string };
  startTime?: string;
}

const ProviderOngoingJobsView = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [actionType, setActionType] = useState<'complete' | 'pause' | 'resume' | 'cancel' | null>(null);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/jobs/worked', { withCredentials: true });
      // Filter for ongoing or paused jobs
      const ongoing = data.filter((job: Job) => ['in_progress', 'paused', 'pending_completion'].includes(job.status));
      setJobs(ongoing);
    } catch (error) {
      console.error('Failed to fetch ongoing jobs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleActionClick = (job: Job, type: 'complete' | 'pause' | 'resume' | 'cancel') => {
      setSelectedJob(job);
      setActionType(type);
      setOpenDialog(true);
  };

  const handleConfirmAction = async () => {
      if (!selectedJob || !actionType) return;
      
      let newStatus = '';
      if (actionType === 'complete') newStatus = 'pending_completion';
      if (actionType === 'pause') newStatus = 'paused';
      if (actionType === 'resume') newStatus = 'in_progress';
      if (actionType === 'cancel') newStatus = 'canceled';

      try {
          await axios.put(`http://localhost:5000/api/jobs/${selectedJob._id}`, { status: newStatus }, { withCredentials: true });
          showToast(`Job ${actionType}d successfully!`, 'success');
          fetchJobs();
          setOpenDialog(false);
      } catch (error) {
          showToast(`Failed to ${actionType} job`, 'error');
      }
  };

  const handleCloseDialog = () => {
      setOpenDialog(false);
      setSelectedJob(null);
      setActionType(null);
  };

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>Ongoing Jobs (Provider)</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>Jobs you are currently working on.</Typography>

      {jobs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f9fafb' }} elevation={0}>
          <Typography color="text.secondary">No ongoing jobs.</Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {jobs.map((job) => (
            <Paper key={job._id} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <Typography variant="h6" fontWeight="bold">{job.title}</Typography>
                          <Chip 
                            label={job.status === 'paused' ? 'PAUSED' : (job.status === 'pending_completion' ? 'PENDING APPROVAL' : 'IN PROGRESS')} 
                            color={job.status === 'paused' ? 'warning' : (job.status === 'pending_completion' ? 'default' : 'success')} 
                            size="small" 
                            sx={{ fontWeight: 'bold' }}
                          />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Client: {job.seekerId?.name}
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
                      {job.startTime && (
                          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'success.main', fontWeight: 'bold' }}>
                              Started: {format(new Date(job.startTime), 'MMM d, h:mm a')}
                          </Typography>
                      )}
                  </Box>
                  <Box textAlign="right">
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                          ${job.currentPay || job.originalPay}
                      </Typography>
                      
                      <Stack direction="row" spacing={1} mt={2}>
                          {/* Providers might not be able to cancel in progress easily, but keeping for now */}
                          <Button 
                            variant="outlined" 
                            color={job.status === 'paused' ? 'info' : 'warning'} 
                            size="small"
                            startIcon={job.status === 'paused' ? <PlayArrowIcon /> : <PauseIcon />}
                            onClick={() => handleActionClick(job, job.status === 'paused' ? 'resume' : 'pause')}
                          >
                            {job.status === 'paused' ? 'Resume' : 'Pause'}
                          </Button>
                           <Button 
                            variant="contained" 
                            color="success" 
                            size="small"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleActionClick(job, 'complete')}
                          >
                            Complete
                          </Button>
                          {job.status === 'pending_completion' && (
                              <Chip label="Waiting for Approval" size="small" color="default" sx={{ ml: 1 }} />
                          )}
                      </Stack>
                  </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ textTransform: 'capitalize' }}>
            {actionType} Job?
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                Are you sure you want to {actionType} this job?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseDialog}>No</Button>
            <Button onClick={handleConfirmAction} autoFocus variant="contained" color="primary">
                Yes, {actionType}
            </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProviderOngoingJobsView;
