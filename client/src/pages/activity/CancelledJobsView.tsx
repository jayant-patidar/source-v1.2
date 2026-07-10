import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/job.service';
import { formatDistanceToNow } from 'date-fns';
import { useToastStore } from '../../store/toastStore';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReplayIcon from '@mui/icons-material/Replay';
import { useNavigate } from 'react-router-dom';

const CancelledJobsView = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastStore();

  const fetchJobs = async () => {
    try {
      const data = await jobService.getCancelledJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching cancelled jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

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

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Cancelled Jobs</Typography>
        <Typography variant="body2" color="text.secondary">Jobs you've cancelled.</Typography>
      </Box>

      {jobs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">No cancelled jobs.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {jobs.map((job) => (
            <Paper key={job._id} variant="outlined" sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label="CANCELED" size="small" color="error" sx={{ fontWeight: 'bold' }} />
              </Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ flexGrow: 1 }}>
                <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{job.title}</Link>
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">{job.location?.general || 'Location not specified'}</Typography>
                <Typography variant="h6" fontWeight="bold" color="text.secondary">${job.currentPay || job.originalPay}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Cancelled {formatDistanceToNow(new Date(job.updatedAt))} ago
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                <Button variant="outlined" size="small" startIcon={<ReplayIcon />} onClick={() => navigate('/post-job', { state: { repostJob: job } })} sx={{ flex: 1, color: '#6366f1', borderColor: '#6366f1' }}>
                  Repost
                </Button>
                <Button variant="outlined" size="small" startIcon={<ArchiveIcon />} onClick={() => handleArchive(job._id)} sx={{ flex: 1 }}>
                  Archive
                </Button>
                <Button variant="outlined" size="small" startIcon={<VisibilityIcon />} component={Link} to={`/jobs/${job._id}`} sx={{ flex: 1 }}>
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
    </Box>
  );
};

export default CancelledJobsView;
