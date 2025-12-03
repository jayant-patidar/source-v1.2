import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Button, CircularProgress, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

interface Job {
  _id: string;
  title: string;
  description: string;
  originalPay: number;
  status: 'open' | 'closed' | 'in_progress' | 'completed';
  createdAt: string;
  location: {
    general: string;
    exact: string;
  };
  negotiations: any[];
}

const PostedJobsView = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/jobs/posted', { withCredentials: true });
      setJobs(data);
    } catch (error) {
      console.error('Error fetching posted jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, { withCredentials: true });
      fetchJobs(); // Refresh list
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  if (jobs.length === 0) {
    return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">No jobs posted yet.</Typography>
            <Typography variant="body2" color="text.secondary">
                Ready to find help? <Link to="/post-job" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>Post a Job</Link>
            </Typography>
        </Box>
    );
  }

  return (
    <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
                <Typography variant="h5" fontWeight="bold">Posted Jobs</Typography>
                <Typography variant="body2" color="text.secondary">Manage the jobs you've shared with the community.</Typography>
            </Box>
            <Button 
                component={Link} 
                to="/post-job" 
                variant="contained" 
                sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
            >
                Post New Job
            </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {jobs.map((job) => (
                <Box key={job._id}>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Chip 
                                label={job.status.toUpperCase()} 
                                color={job.status === 'open' ? 'success' : job.status === 'closed' ? 'default' : 'primary'} 
                                size="small" 
                                sx={{ fontWeight: 'bold' }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {formatDistanceToNow(new Date(job.createdAt))} ago
                            </Typography>
                        </Box>

                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ flexGrow: 1 }}>
                            <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                {job.title}
                            </Link>
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                {job.location?.general || 'Location not specified'}
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" color="success.main">
                                ${job.originalPay}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, pt: 2, borderTop: '1px solid #f0f0f0' }}>
                            <Button 
                                component={Link} 
                                to={`/jobs/${job._id}`}
                                variant="outlined" 
                                size="small"
                                startIcon={<VisibilityIcon />}
                                fullWidth
                            >
                                View
                            </Button>
                            <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => handleDelete(job._id)}
                                sx={{ border: '1px solid', borderColor: 'error.main', borderRadius: 1 }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Paper>
                </Box>
            ))}
        </Box>
    </Box>
  );
};

export default PostedJobsView;
