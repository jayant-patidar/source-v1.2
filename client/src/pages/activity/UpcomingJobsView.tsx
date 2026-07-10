import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper, Chip, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/job.service';
import { formatLocalDate } from '../../utils/dateUtils';
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {jobs.map((job) => (
            <Accordion key={job._id} sx={{ borderRadius: 2, '&:before': { display: 'none' }, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ bgcolor: '#ffffff', '&:hover': { bgcolor: '#f8fafc' }, transition: 'background-color 0.2s' }}
              >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2, pr: 1 }}>
                      <Chip 
                        label={job.status === 'pending_start_approval' ? "PENDING" : "UPCOMING"} 
                        color={job.status === 'pending_start_approval' ? "warning" : "info"} 
                        size="small" 
                        sx={{ fontWeight: 'bold' }} 
                      />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold', color: '#0f172a' }}>
                              {job.title}
                          </Typography>
                      </Box>

                      <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                          <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                              ${job.currentPay || job.originalPay}
                          </Typography>
                      </Box>
                      
                      <Box display={{ xs: 'none', md: 'flex' }} alignItems="center" gap={0.5} ml="auto">
                          <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                              {formatLocalDate(job.jobDate, 'MMM d')} at {job.jobTime}
                          </Typography>
                      </Box>
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
                              Client: <Link to={`/profile/${job.seekerId?._id}`} style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 'bold' }}>{job.seekerId?.name}</Link>
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              When: {formatLocalDate(job.jobDate, 'MMM d, yyyy')} at {job.jobTime}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                              <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">{job.location.general}</Typography>
                          </Box>
                      </Box>

                      <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                      <Divider sx={{ display: { xs: 'block', sm: 'none' } }} />

                      {/* Right Side: Actions */}
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5, display: 'block' }}>
                              Quick Actions
                          </Typography>
                          
                          <Button 
                            variant="contained" 
                            size="small" 
                            color="primary" 
                            startIcon={<PlayArrowIcon />}
                            onClick={() => handleStartClick(job)}
                            disabled={job.status === 'pending_start_approval'}
                            sx={{ width: 'fit-content' }}
                          >
                            {job.status === 'pending_start_approval' ? "Waiting for Approval..." : "Start Job Now"}
                          </Button>
                      </Box>
                  </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
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
