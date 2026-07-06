import { Card, CardContent, Typography, Button, Box, Chip, Avatar, IconButton, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LoopIcon from '@mui/icons-material/Loop';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import SendIcon from '@mui/icons-material/Send';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useState } from 'react';
import { offerService } from '../services/offer.service';
import { useToastStore } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';

import { jobService } from '../services/job.service';

const JobCard = ({ job }: { job: any }) => {
  // ... (state hooks)
  const [open, setOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [message, setMessage] = useState('');
  const [offerMode, setOfferMode] = useState<'negotiate' | 'interested'>('negotiate');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSaved, setIsSaved] = useState(false); // Initial state should be checked from user profile
  const { showToast } = useToastStore();
  const { user } = useAuthStore();
  
  const isPoster = user && (job.seekerId === user._id || (job.seekerId && job.seekerId._id === user._id));

  // Guard: show login prompt if user is not authenticated
  const requireAuth = (action: () => void) => {
    if (!user) {
      showToast('Please login', 'warning');
      return;
    }
    action();
  };
  const menuOpen = Boolean(anchorEl);

  const handleSave = async () => {
    try {
      await jobService.toggleSaveJob(job._id);
      setIsSaved(!isSaved);
      showToast(isSaved ? "Job Unsaved" : "Job Saved", 'success');
    } catch (error) {
      console.error('Error toggling save:', error);
      showToast('Failed to save job', 'error');
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action: string) => {
    // console.log(`Action: ${action} for job ${job._id}`);
    handleMenuClose();
    // Implement actual logic here (e.g., API call)
  };

  const handleClose = () => setOpen(false);

  const handleSend = async () => {
    try {
      await offerService.createOffer({
        jobId: job._id,
        amount: Number(offerAmount),
        message
      });
      showToast('Offer sent successfully!', 'success');
      handleClose();
    } catch (error: any) {
      console.error('Error sending notification:', error);
      showToast(error.response?.data?.message || 'Failed to send offer.', 'error');
    }
  };

  return (
    <>
      <Card sx={{ 
        mb: 4, 
        borderRadius: 4, 
        bgcolor: 'white',
        boxShadow: '0 12px 40px rgba(0,0,0,0.06)', 
        border: '1px solid #f1f5f9', 
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
        overflow: 'visible',
        '&:hover': { 
          transform: 'translateY(-6px)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.12)',
          borderColor: 'rgba(99, 102, 241, 0.2)'
        } 
      }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          
          {/* Header: User Info & Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Link to={`/profile/${job.seekerId?._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Box sx={{ 
                  p: '3px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  boxShadow: '0 4px 10px rgba(99,102,241,0.2)'
                }}>
                  <Avatar 
                    src={job.seekerId?.avatar} 
                    alt={job.seekerId?.name}
                    sx={{ width: 44, height: 44, border: '2px solid white', bgcolor: '#0f172a', fontWeight: 'bold' }}
                  >
                    {job.seekerId?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </Box>
              </Link>
              <Box>
                <Link to={`/profile/${job.seekerId?._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="subtitle1" fontWeight="800" sx={{ lineHeight: 1.2, color: '#0f172a', '&:hover': { color: '#4f46e5' } }}>
                    {job.seekerId?.name || 'Unknown User'}
                  </Typography>
                </Link>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {job.createdAt ? format(new Date(job.createdAt), 'MMM d, h:mm a') : 'Recently'} 
                  <span style={{ color: '#cbd5e1' }}>•</span> 
                  <span style={{ color: '#eab308', display: 'flex', alignItems: 'center' }}>
                    {job.seekerId?.seekerRating || 'N/A'} <span style={{ fontSize: '12px', marginLeft: '2px' }}>★</span>
                  </span>
                </Typography>
              </Box>
            </Box>
            
            <Box>
              <IconButton size="small" onClick={handleMenuClick} sx={{ color: '#94a3b8', '&:hover': { bgcolor: '#f1f5f9', color: '#0f172a' } }}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: { borderRadius: 3, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', mt: 1, minWidth: 160 }
                }}
              >
                <MenuItem onClick={() => handleMenuAction('report')} sx={{ color: '#ef4444' }}>
                  <ListItemIcon><ReportProblemIcon fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
                  <ListItemText primaryTypographyProps={{ fontWeight: 600 }}>Report Job</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleMenuAction('not_interested')} sx={{ color: '#64748b' }}>
                  <ListItemIcon><NotInterestedIcon fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
                  <ListItemText primaryTypographyProps={{ fontWeight: 600 }}>Not Interested</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Job Title & Pay Row */}
          <Box sx={{ mb: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
            <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
              <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: '-0.5px', color: '#0f172a', lineHeight: 1.3, '&:hover': { textDecoration: 'underline' } }}>
                {job.title}
              </Typography>
            </Link>
            
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
              {job.currentPay && job.currentPay !== job.originalPay ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#f8fafc', p: 0.5, pr: 1.5, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                  <Typography variant="body1" sx={{ textDecoration: 'line-through', color: '#94a3b8', fontWeight: 700, ml: 1 }}>
                    ${job.originalPay}
                  </Typography>
                  <Chip 
                    label={`$${job.currentPay}`} 
                    sx={{ bgcolor: '#10b981', color: 'white', fontWeight: 900, borderRadius: '8px', px: 1, py: 2.5, fontSize: '1.2rem' }} 
                  />
                </Box>
              ) : (
                <Chip 
                  label={`$${job.originalPay}`} 
                  sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.2)', fontWeight: 900, borderRadius: '8px', px: 1, py: 2.5, fontSize: '1.2rem' }} 
                />
              )}
              
              <Chip 
                label={job.type === 'hourly' ? 'Hourly' : 'Fixed'} 
                size="small"
                sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 700, borderRadius: '8px' }} 
              />
              
              {job.isNegotiable === false && (
                <Chip 
                  label="Fixed Price" 
                  size="small"
                  sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontWeight: 700, borderRadius: '8px' }} 
                />
              )}
            </Box>
          </Box>

          {/* Description */}
          <Typography variant="body1" sx={{ color: '#475569', mb: 3, lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {job.description}
          </Typography>

          {job.requirements && job.requirements.length > 0 && (
            <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Requires:
                </Typography>
                {job.requirements.slice(0, 3).map((req: string, index: number) => (
                    <Chip
                        key={index}
                        label={req}
                        size="small"
                        sx={{ 
                          bgcolor: 'rgba(99, 102, 241, 0.08)', 
                          color: '#4f46e5', 
                          fontWeight: 600,
                          borderRadius: 2,
                          height: 24
                        }}
                    />
                ))}
                {job.requirements.length > 3 && (
                    <Typography variant="caption" fontWeight="bold" color="#94a3b8" sx={{ ml: 0.5 }}>
                        +{job.requirements.length - 3} more
                    </Typography>
                )}
            </Box>
          )}

          {/* Details: Date, Location */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #f1f5f9' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ p: 0.5, borderRadius: 1.5, bgcolor: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', display: 'flex' }}>
                <AccessTimeIcon sx={{ fontSize: 18 }} />
              </Box>
              <Typography variant="body2" fontWeight="600" color="#334155">
                  {job.jobDate ? format(new Date(job.jobDate), 'MMM d, yyyy') : 'Flexible Timing'}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: '#e2e8f0', display: { xs: 'none', sm: 'block' } }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ p: 0.5, borderRadius: 1.5, bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex' }}>
                <LocationOnIcon sx={{ fontSize: 18 }} />
              </Box>
              <Typography variant="body2" fontWeight="600" color="#334155">
                  {job.location?.general || 'Remote Work'}
              </Typography>
            </Box>
          </Box>

          {!isPoster && (
            <Box sx={{ mt: 1 }}>
              <Divider sx={{ mb: 3, borderStyle: 'dashed', borderColor: '#e2e8f0' }} />
              
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {/* Actions Icons Row */}
                <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', alignItems: 'center', gap: 1, p: 1, pr: 2,
                      borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                      color: '#64748b', '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5' }
                    }} 
                    onClick={() => requireAuth(() => { 
                      if (job.isNegotiable === false) {
                        showToast('This job is non-negotiable. You can only express interest at the listed price.', 'warning');
                        return;
                      }
                      setOfferMode('negotiate'); setOfferAmount(''); setOpen(true); 
                    })}
                  >
                    <Box sx={{ bgcolor: 'white', p: 0.5, borderRadius: '50%', display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      <LoopIcon sx={{ fontSize: 18, color: 'inherit' }} />
                    </Box>
                    <Typography variant="caption" fontWeight="700">Negotiate</Typography>
                  </Box>

                  <Box 
                    sx={{ 
                      display: 'flex', alignItems: 'center', gap: 1, p: 1, pr: 2,
                      borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                      color: '#64748b', '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#059669' }
                    }} 
                    onClick={() => requireAuth(() => showToast('Requesting exact location...', 'info'))}
                  >
                    <Box sx={{ bgcolor: 'white', p: 0.5, borderRadius: '50%', display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      <ShareLocationIcon sx={{ fontSize: 18, color: 'inherit' }} />
                    </Box>
                    <Typography variant="caption" fontWeight="700">Locate</Typography>
                  </Box>

                  <Box 
                    sx={{ 
                      display: 'flex', alignItems: 'center', gap: 1, p: 1, pr: 2,
                      borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                      color: '#64748b', '&:hover': { bgcolor: 'rgba(236, 72, 153, 0.1)', color: '#db2777' }
                    }} 
                    onClick={() => requireAuth(() => showToast('Share functionality coming soon!', 'info'))}
                  >
                    <Box sx={{ bgcolor: 'white', p: 0.5, borderRadius: '50%', display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      <SendIcon sx={{ fontSize: 18, color: 'inherit' }} />
                    </Box>
                    <Typography variant="caption" fontWeight="700">Share</Typography>
                  </Box>

                  <Box 
                    sx={{ 
                      display: 'flex', alignItems: 'center', gap: 1, p: 1, pr: 2,
                      borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                      color: isSaved ? '#eab308' : '#64748b', '&:hover': { bgcolor: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }
                    }} 
                    onClick={() => requireAuth(handleSave)}
                  >
                    <Box sx={{ bgcolor: 'white', p: 0.5, borderRadius: '50%', display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      {isSaved ? <BookmarkIcon sx={{ fontSize: 18, color: 'inherit' }} /> : <BookmarkBorderIcon sx={{ fontSize: 18, color: 'inherit' }} />}
                    </Box>
                    <Typography variant="caption" fontWeight="700">{isSaved ? 'Saved' : 'Save'}</Typography>
                  </Box>

                </Box>

                {/* Interested Button */}
                <Button 
                    variant="contained" 
                    onClick={() => requireAuth(() => { setOfferMode('interested'); setOfferAmount(job.originalPay); setOpen(true); })}
                    sx={{ 
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                      color: 'white', 
                      fontWeight: '800',
                      px: { xs: 3, sm: 5 },
                      py: 1.2,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: '0 8px 20px rgba(15,23,42,0.2)',
                      transition: 'all 0.3s',
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 25px rgba(15,23,42,0.3)',
                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                      }
                    }}
                  >
                    I'm Interested
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Interested Modal */}
      {/* Offer Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
            {offerMode === 'interested' ? 'Express Interest' : 'Make an Offer'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {offerMode === 'interested' 
                ? `Let ${job.seekerId?.name || 'the poster'} know you're interested in this job at the listed pay.` 
                : `Send a proposal to ${job.seekerId?.name || 'the poster'} with your requested pay.`}
          </Typography>
          
          {offerMode === 'negotiate' ? (
              <TextField
                autoFocus
                margin="dense"
                label="Offer Amount ($)"
                type="number"
                fullWidth
                variant="outlined"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                sx={{ mb: 2, mt: 2 }}
              />
          ) : (
              <Box sx={{ my: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                      Proposing to work for: <span style={{ color: '#2e7d32' }}>${job.originalPay}</span>
                  </Typography>
              </Box>
          )}
          
          <TextField
            margin="dense"
            label="Message (Optional)"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={offerMode === 'interested' ? "I'm available to start immediately..." : "Hi, I can help you with this..."}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button 
            onClick={handleSend} 
            variant="contained" 
            disabled={!offerAmount}
            sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: '#333' } }}
          >
            {offerMode === 'interested' ? 'Send Interest' : 'Send Offer'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JobCard;
