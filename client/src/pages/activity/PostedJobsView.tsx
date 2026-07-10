import { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 

    Chip, 
    Button, 
    CircularProgress, 
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate, Link } from 'react-router-dom';
import { jobService } from '../../services/job.service';
import { formatDistanceToNow } from 'date-fns';
import { useToastStore } from '../../store/toastStore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';
import ArchiveIcon from '@mui/icons-material/Archive';
import ReplayIcon from '@mui/icons-material/Replay';

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
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastStore();
  
  // Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [updatePayDialogOpen, setUpdatePayDialogOpen] = useState(false);

  const fetchJobs = async () => {
    try {
      const data = await jobService.getPostedJobs();
      // Filter out non-active jobs
      // Active jobs are either 'open' or 'in_progress'. 
      // If 'open', it must not be expired. If 'in_progress', it remains active regardless of expiration date.
      const now = new Date();
      const activeJobs = data.filter((j: any) => {
        if (j.status === 'completed' || j.status === 'canceled') return false;
        if (j.status === 'open' && new Date(j.expirationDate) < now) return false;
        return true;
      });
      
      setJobs(activeJobs);
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
          showToast(`Job is now ${!currentVisibility ? 'visible' : 'hidden'}`, 'success');
          fetchJobs(); // Re-fetch to update visibility
      } catch (error) {
          console.error('Error toggling visibility:', error);
          showToast('Failed to update visibility', 'error');
      } finally {
          handleMenuClose();
      }
  };

  const handleCancelJob = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this job?')) return;
    try {
      await jobService.updateJob(id, { status: 'canceled' }); 
      showToast('Job canceled successfully', 'info');
      fetchJobs();
    } catch (error) {
       console.error('Error canceling job:', error);
       showToast('Failed to cancel job', 'error');
    } finally {
        handleMenuClose();
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;
    try {
      await jobService.deleteJob(id);
      setJobs(jobs.filter(job => job._id !== id));
      showToast('Job deleted permanently', 'success');
    } catch (error) {
      console.error('Error deleting job:', error);
      showToast('Failed to delete job', 'error');
    } finally {
        handleMenuClose();
    }
  };

  const handleArchiveJob = async (id: string) => {
    try {
      await jobService.archiveJob(id);
      showToast('Job archived', 'success');
      fetchJobs();
    } catch (error) {
      console.error('Error archiving job:', error);
      showToast('Failed to archive job', 'error');
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

  const handleRepostClick = () => {
      if (selectedJob) {
          navigate('/post-job', { state: { repostJob: selectedJob } });
      }
      handleMenuClose();
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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {jobs.map((job) => (
                <Accordion key={job._id} sx={{ borderRadius: 2, '&:before': { display: 'none' }, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ bgcolor: '#ffffff', '&:hover': { bgcolor: '#f8fafc' }, transition: 'background-color 0.2s' }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2, pr: 1 }}>
                            <Chip 
                                label={job.status.toUpperCase()} 
                                color={job.status === 'open' ? 'success' : job.status === 'canceled' ? 'error' : 'default'} 
                                size="small" 
                                sx={{ fontWeight: 'bold' }}
                            />
                            {!job.visibility && (
                                <Chip 
                                    icon={<VisibilityOffIcon sx={{ fontSize: '14px !important' }} />} 
                                    label="HIDDEN" 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                                />
                            )}
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold', color: '#0f172a' }}>
                                    {job.title}
                                </Typography>
                            </Box>

                            <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                                {job.currentPay && job.currentPay !== job.originalPay ? (
                                    <>
                                        <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary', mr: 1 }}>
                                            ${job.originalPay}
                                        </Typography>
                                        <Typography variant="subtitle2" fontWeight="bold" color="success.main" component="span">
                                            ${job.currentPay}
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography variant="subtitle2" fontWeight="bold" color="success.main">
                                        ${job.originalPay}
                                    </Typography>
                                )}
                            </Box>
                            
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto', whiteSpace: 'nowrap', display: { xs: 'none', md: 'block' } }}>
                                {formatDistanceToNow(new Date(job.createdAt))} ago
                            </Typography>
                            
                            <IconButton 
                                size="small" 
                                onClick={(e) => { e.stopPropagation(); handleMenuOpen(e, job); }}
                            >
                                <MoreVertIcon />
                            </IconButton>
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
                                    Location: {job.location?.general || 'Location not specified'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    Posted: {formatDistanceToNow(new Date(job.createdAt))} ago
                                </Typography>
                                {!job.visibility && (
                                    <Typography variant="body2" color="error" sx={{ mt: 1, fontWeight: 'bold' }}>
                                        This job is currently hidden from the public feed.
                                    </Typography>
                                )}
                            </Box>

                            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                            <Divider sx={{ display: { xs: 'block', sm: 'none' } }} />

                            {/* Right Side: Actions */}
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5, display: 'block' }}>
                                    Quick Actions
                                </Typography>
                                <Button 
                                    component={Link} 
                                    to={`/jobs/${job._id}`}
                                    state={{ job }}
                                    variant="outlined" 
                                    size="small"
                                    startIcon={<VisibilityIcon />}
                                    sx={{ width: 'fit-content' }}
                                >
                                    View Full Details
                                </Button>
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>
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
            <MenuItem onClick={() => selectedJob && handleArchiveJob(selectedJob._id)}>
                <ListItemIcon><ArchiveIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Archive Job</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => selectedJob && handleDeleteJob(selectedJob._id)} sx={{ color: 'error.main' }}>
                <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                <ListItemText>Delete Job</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleRepostClick}>
                <ListItemIcon><ReplayIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Repost Job</ListItemText>
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
