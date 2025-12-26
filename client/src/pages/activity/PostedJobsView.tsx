import { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Chip, 
    Button, 
    CircularProgress, 
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/job.service';
import { formatDistanceToNow } from 'date-fns';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';

import EditJobDialog from '../../components/jobs/EditJobDialog';
import UpdatePayDialog from '../../components/jobs/UpdatePayDialog';

interface Job {
  _id: string;
  title: string;
  description: string;
  originalPay: number;
  currentPay?: number;
  status: 'open' | 'closed' | 'in_progress' | 'completed' | 'canceled';
  createdAt: string;
  location: {
    general: string;
    exact: string;
  };
  visibility: boolean;
  category?: string;
  tags?: string[];
  negotiations: any[];
}

const PostedJobsView = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [updatePayDialogOpen, setUpdatePayDialogOpen] = useState(false);

  const fetchJobs = async () => {
    try {
      const data = await jobService.getPostedJobs();
      // Filter out non-active jobs if needed, but endpoint usually returns all posted by user
      // Assuming endpoint returns all, we filter on frontend or rely on backend
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

  // Menu Handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, job: Job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  // Action Handlers
  const handleEditClick = () => {
    setEditDialogOpen(true);
    setAnchorEl(null); // Keep selectedJob for the dialog
  };

  const handleUpdatePayClick = () => {
    setUpdatePayDialogOpen(true);
    setAnchorEl(null);
  };

  const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
      try {
          await jobService.updateJob(id, { visibility: !currentVisibility });
          // showToast(`Job is now ${!currentVisibility ? 'visible' : 'hidden'}`, 'success');
          fetchJobs(); // Re-fetch to update visibility
      } catch (error) {
          console.error('Error toggling visibility:', error);
          // showToast('Failed to update visibility', 'error');
          alert('Failed to update visibility'); // Fallback for showToast
      } finally {
          handleMenuClose();
      }
  };

  const handleCancelJob = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this job?')) return;
    try {
      await jobService.updateJob(id, { status: 'canceled' }); 
      fetchJobs();
    } catch (error) {
       console.error('Error canceling job:', error);
       alert('Failed to cancel job');
    } finally {
        handleMenuClose();
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;
    try {
      await jobService.deleteJob(id);
      setJobs(jobs.filter(job => job._id !== id));
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    } finally {
        handleMenuClose();
    }
  };

  const handleSaveJob = async (jobId: string, updatedData: any) => {
      try {
          await jobService.updateJob(jobId, updatedData);
          fetchJobs();
      } catch (error) {
          console.error('Error updating job:', error);
          throw error;
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
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip 
                                    label={job.status.toUpperCase()} 
                                    color={job.status === 'open' ? 'success' : job.status === 'canceled' ? 'error' : 'default'} 
                                    size="small" 
                                    sx={{ fontWeight: 'bold' }}
                                />
                                {!job.visibility && (
                                    <Chip 
                                        icon={<VisibilityOffIcon />} 
                                        label="HIDDEN" 
                                        size="small" 
                                        variant="outlined"
                                    />
                                )}
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                                    {formatDistanceToNow(new Date(job.createdAt))} ago
                                </Typography>
                                <IconButton 
                                    size="small" 
                                    onClick={(e) => handleMenuOpen(e, job)}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </Box>
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
                            <Box sx={{ textAlign: 'right' }}>
                                {job.currentPay && job.currentPay !== job.originalPay ? (
                                    <>
                                        <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary', mr: 1 }}>
                                            ${job.originalPay}
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold" color="success.main" component="span">
                                            ${job.currentPay}
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography variant="h6" fontWeight="bold" color="success.main">
                                        ${job.originalPay}
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        <Button 
                            component={Link} 
                            to={`/jobs/${job._id}`}
                            state={{ job }}
                            variant="outlined" 
                            size="small"
                            startIcon={<VisibilityIcon />}
                            fullWidth
                            sx={{ mt: 'auto' }}
                        >
                            View Details
                        </Button>
                    </Paper>
                </Box>
            ))}
        </Box>

        {/* Actions Menu */}
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleEditClick}>
                <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Edit Job</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleUpdatePayClick}>
                <ListItemIcon><AttachMoneyIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Update Pay</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => selectedJob && handleToggleVisibility(selectedJob._id, selectedJob.visibility)}>
                <ListItemIcon>
                    {selectedJob?.visibility ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                </ListItemIcon>
                <ListItemText>{selectedJob?.visibility ? 'Hide Job' : 'Show Job'}</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => selectedJob && handleCancelJob(selectedJob._id)} disabled={selectedJob?.status === 'canceled' || selectedJob?.status === 'completed'}>
                <ListItemIcon><CancelIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Cancel Job</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => selectedJob && handleDeleteJob(selectedJob._id)} sx={{ color: 'error.main' }}>
                <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                <ListItemText>Delete Job</ListItemText>
            </MenuItem>
        </Menu>

        {/* Dialogs */}
        {selectedJob && (
            <>
                <EditJobDialog 
                    open={editDialogOpen} 
                    onClose={() => { setEditDialogOpen(false); setSelectedJob(null); }} 
                    job={selectedJob} 
                    onSave={handleSaveJob} 
                />
                <UpdatePayDialog 
                    open={updatePayDialogOpen} 
                    onClose={() => { setUpdatePayDialogOpen(false); setSelectedJob(null); }} 
                    currentPay={selectedJob.currentPay || selectedJob.originalPay} 
                    jobId={selectedJob._id} 
                    onSave={handleSaveJob} 
                />
            </>
        )}
    </Box>
  );
};

export default PostedJobsView;
