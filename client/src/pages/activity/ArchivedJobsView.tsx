import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/job.service';
import { formatDistanceToNow } from 'date-fns';
import { useToastStore } from '../../store/toastStore';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ArchivedJobsView = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastStore();

  const fetchJobs = async () => {
    try {
      const data = await jobService.getArchivedJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching archived jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleUnarchive = async (id: string) => {
    try {
      await jobService.unarchiveJob(id);
      showToast('Job unarchived', 'success');
      fetchJobs();
    } catch (error) {
      console.error('Error unarchiving job:', error);
      showToast('Failed to unarchive job', 'error');
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
        <Typography variant="h5" fontWeight="bold">Archived Jobs</Typography>
        <Typography variant="body2" color="text.secondary">Jobs you've archived. Unarchive to restore them.</Typography>
      </Box>

      {jobs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">No archived jobs.</Typography>
          <Typography variant="body2" color="text.secondary">Jobs you archive will appear here.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {jobs.map((job) => (
            <Paper key={job._id} variant="outlined" sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label="ARCHIVED" size="small" sx={{ fontWeight: 'bold', bgcolor: '#616161', color: 'white' }} />
                <Chip label={job.status.toUpperCase()} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />
              </Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ flexGrow: 1 }}>
                <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{job.title}</Link>
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">{job.location?.general || 'Location not specified'}</Typography>
                <Typography variant="h6" fontWeight="bold" color="success.main">${job.currentPay || job.originalPay}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Archived {formatDistanceToNow(new Date(job.updatedAt))} ago
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                <Button variant="contained" size="small" startIcon={<UnarchiveIcon />} onClick={() => handleUnarchive(job._id)}
                  sx={{ flex: 1, bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}>
                  Unarchive
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

export default ArchivedJobsView;
