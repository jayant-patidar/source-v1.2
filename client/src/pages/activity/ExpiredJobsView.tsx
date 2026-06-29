import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/job.service';
import { format, formatDistanceToNow } from 'date-fns';
import { useToastStore } from '../../store/toastStore';
import ReplayIcon from '@mui/icons-material/Replay';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ExpiredJobsView = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastStore();

  // Repost dialog state
  const [repostOpen, setRepostOpen] = useState(false);
  const [repostJobId, setRepostJobId] = useState('');
  const [newExpirationDate, setNewExpirationDate] = useState('');
  const [repostJobDate, setRepostJobDate] = useState('');
  const [repostJobTime, setRepostJobTime] = useState('');

  const fetchJobs = async () => {
    try {
      const data = await jobService.getExpiredJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching expired jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleRepostClick = (jobId: string) => {
    setRepostJobId(jobId);
    const job = jobs.find(j => j._id === jobId);
    if (job) {
      setRepostJobDate(job.jobDate ? format(new Date(job.jobDate), 'yyyy-MM-dd') : '');
      setRepostJobTime(job.jobTime || '');
    }
    setNewExpirationDate('');
    setRepostOpen(true);
  };

  const handleRepostSubmit = async () => {
    if (!newExpirationDate) {
      showToast('Please select a new expiration date', 'warning');
      return;
    }
    try {
      await jobService.repostJob(repostJobId, {
        expirationDate: newExpirationDate,
        jobDate: repostJobDate,
        jobTime: repostJobTime
      });
      showToast('Job reposted successfully!', 'success');
      setRepostOpen(false);
      fetchJobs();
    } catch (error: any) {
      console.error('Error reposting job:', error);
      showToast(error.response?.data?.error || 'Failed to repost job', 'error');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await jobService.archiveJob(id);
      showToast('Job archived', 'success');
      fetchJobs();
    } catch (error) {
      console.error('Error archiving job:', error);
      showToast('Failed to archive job', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this job?')) return;
    try {
      await jobService.deleteJob(id);
      setJobs(jobs.filter(j => j._id !== id));
      showToast('Job deleted permanently', 'success');
    } catch (error) {
      console.error('Error deleting job:', error);
      showToast('Failed to delete job', 'error');
    }
  };

  // Get tomorrow's date as min for the date picker
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Expired Jobs</Typography>
        <Typography variant="body2" color="text.secondary">Jobs whose expiration date has passed. Repost them with a new date to make them active again.</Typography>
      </Box>

      {jobs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">No expired jobs.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {jobs.map((job) => (
            <Paper key={job._id} variant="outlined" sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label="EXPIRED" size="small" sx={{ fontWeight: 'bold', bgcolor: '#ff9800', color: 'white' }} />
                <Chip 
                  label={`Expired ${formatDistanceToNow(new Date(job.expirationDate))} ago`} 
                  size="small" 
                  variant="outlined" 
                  sx={{ fontWeight: 'bold', fontSize: '0.7rem' }} 
                />
              </Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ flexGrow: 1 }}>
                <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{job.title}</Link>
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">{job.location?.general || 'Location not specified'}</Typography>
                <Typography variant="h6" fontWeight="bold" color="text.secondary">${job.currentPay || job.originalPay}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Expiration: {format(new Date(job.expirationDate), 'MMM d, yyyy')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                <Button variant="contained" size="small" startIcon={<ReplayIcon />} onClick={() => handleRepostClick(job._id)}
                  sx={{ flex: 1, bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}>
                  Repost
                </Button>
                <Button variant="outlined" size="small" startIcon={<ArchiveIcon />} onClick={() => handleArchive(job._id)}>
                  Archive
                </Button>
                <Button variant="outlined" size="small" startIcon={<VisibilityIcon />} component={Link} to={`/jobs/${job._id}`}>
                  View
                </Button>
                <Button variant="outlined" size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(job._id)}>
                  Delete
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Repost Dialog */}
      <Dialog open={repostOpen} onClose={() => setRepostOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Repost Job</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose a new expiration date to make this job active again. It will reappear in the public feed.
          </Typography>
          <TextField
            label="New Expiration Date"
            type="date"
            fullWidth
            value={newExpirationDate}
            onChange={(e) => setNewExpirationDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: minDate } }}
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            label="Job Date (Optional)"
            type="date"
            fullWidth
            value={repostJobDate}
            onChange={(e) => setRepostJobDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Job Time (Optional)"
            type="time"
            fullWidth
            value={repostJobTime}
            onChange={(e) => setRepostJobTime(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setRepostOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleRepostSubmit} disabled={!newExpirationDate}
            sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}>
            Repost Job
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpiredJobsView;
