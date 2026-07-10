import { useState, useEffect } from 'react';
import { Box, Typography, Chip, Button, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {jobs.map((job) => (
            <Accordion key={job._id} sx={{ borderRadius: 2, '&:before': { display: 'none' }, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ bgcolor: '#ffffff', '&:hover': { bgcolor: '#f8fafc' }, transition: 'background-color 0.2s' }}
              >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2, pr: 1 }}>
                      <Chip label="ARCHIVED" size="small" sx={{ fontWeight: 'bold', bgcolor: '#616161', color: 'white' }} />
                      <Chip label={job.status.toUpperCase()} size="small" variant="outlined" sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'inline-flex' } }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold', color: '#0f172a' }}>
                              {job.title}
                          </Typography>
                      </Box>

                      <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                          <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                              ${job.currentPay || job.originalPay}
                          </Typography>
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto', whiteSpace: 'nowrap', display: { xs: 'none', md: 'block' } }}>
                          {formatDistanceToNow(new Date(job.updatedAt))} ago
                      </Typography>
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
                          <Typography variant="body2" color="text.secondary">
                              Archived: {formatDistanceToNow(new Date(job.updatedAt))} ago
                          </Typography>
                      </Box>

                      <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                      <Divider sx={{ display: { xs: 'block', sm: 'none' } }} />

                      {/* Right Side: Actions */}
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5, display: 'block' }}>
                              Quick Actions
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Button 
                                variant="contained" 
                                size="small" 
                                startIcon={<UnarchiveIcon />} 
                                onClick={() => handleUnarchive(job._id)}
                                sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
                              >
                                Unarchive
                              </Button>
                              <Button 
                                variant="outlined" 
                                size="small" 
                                startIcon={<VisibilityIcon />} 
                                component={Link} 
                                to={`/jobs/${job._id}`}
                              >
                                View
                              </Button>
                              <Button 
                                variant="outlined" 
                                size="small" 
                                color="error" 
                                startIcon={<DeleteIcon />} 
                                onClick={() => handleDelete(job._id)}
                              >
                                Delete
                              </Button>
                          </Box>
                      </Box>
                  </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ArchivedJobsView;
