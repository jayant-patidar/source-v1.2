import { Card, CardContent, Typography, Button, Box, Chip, Avatar, IconButton, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LoopIcon from '@mui/icons-material/Loop';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import SendIcon from '@mui/icons-material/Send';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useState } from 'react';
import axios from 'axios';

const JobCard = ({ job }: { job: any }) => {
  const [open, setOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState(job.originalPay?.toString() || '');
  const [message, setMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action: string) => {
    console.log(`Action: ${action} for job ${job._id}`);
    handleMenuClose();
    // Implement actual logic here (e.g., API call)
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSend = async () => {
    try {
      await axios.post('http://localhost:5000/api/negotiations', {
        jobId: job._id,
        amount: Number(offerAmount),
        message
      }, { withCredentials: true });
      alert('Notification sent successfully!');
      handleClose();
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification.');
    }
  };

  return (
    <>
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 'none', border: '1px solid #e0e0e0', transition: '0.2s', '&:hover': { borderColor: '#000' } }}>
        <CardContent sx={{ p: 3 }}>
          {/* Header: User Info & Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Link to={`/profile/${job.seekerId?._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Avatar 
                  src={job.seekerId?.avatar} 
                  alt={job.seekerId?.name}
                  sx={{ width: 40, height: 40, border: '1px solid #eee' }}
                >
                  {job.seekerId?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </Link>
              <Box>
                <Link to={`/profile/${job.seekerId?._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ lineHeight: 1.2, '&:hover': { textDecoration: 'underline' } }}>
                    {job.seekerId?.name || 'Unknown User'}
                  </Typography>
                </Link>
                <Typography variant="caption" color="text.secondary">
                  {job.createdAt ? format(new Date(job.createdAt), 'MMM d, h:mm a') : 'Recently'} • {job.seekerId?.seekerRating || 'N/A'} ★
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => handleMenuAction('report')}>
                <ListItemIcon>
                  <ReportProblemIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Report Job</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleMenuAction('not_interested')}>
                <ListItemIcon>
                  <NotInterestedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Not Interested</ListItemText>
              </MenuItem>
            </Menu>
          </Box>

          {/* Job Title & Pay Row */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
              <Typography variant="h6" fontWeight="900" sx={{ fontSize: '1.25rem', lineHeight: 1.2, '&:hover': { textDecoration: 'underline' } }}>
                {job.title}
              </Typography>
            </Link>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 2 }}>
              <Chip 
                label={`$${job.originalPay}`} 
                size="small"
                sx={{ 
                  bgcolor: '#000000', 
                  color: 'white', 
                  fontWeight: 'bold', 
                  borderRadius: '8px',
                }} 
              />
              <Chip 
                label={job.type === 'hourly' ? 'Hourly' : 'One-Time'} 
                size="small"
                sx={{ 
                  bgcolor: '#f5f5f5', 
                  color: '#616161', 
                  fontWeight: 'bold', 
                  borderRadius: '8px',
                }} 
              />
            </Box>
          </Box>

          {/* Description */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {job.description}
          </Typography>

          {/* Details: Date, Location */}
          <Box sx={{ display: 'flex', gap: 3, mb: 3, color: '#757575' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" fontWeight="500">
                  {job.jobDate ? format(new Date(job.jobDate), 'MMM d') : 'Flexible'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" fontWeight="500">
                  {job.location?.general || 'Remote'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Actions Icons Row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }}>
                 <LoopIcon sx={{ fontSize: 24, color: 'black' }} />
                 <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5 }}>Negotiate</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }}>
                 <ShareLocationIcon sx={{ fontSize: 24, color: 'black' }} />
                 <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5 }}>Locate</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }}>
                 <SendIcon sx={{ fontSize: 24, color: 'black' }} />
                 <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5 }}>Share</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }}>
                 <BookmarkBorderIcon sx={{ fontSize: 24, color: 'black' }} />
                 <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5 }}>Save</Typography>
              </Box>
          </Box>

          {/* Interested Button */}
          <Button 
              fullWidth
              variant="contained" 
              onClick={handleOpen}
              sx={{ 
                bgcolor: '#000000', 
                color: 'white', 
                fontWeight: 'bold',
                py: 1.2,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': { bgcolor: '#333' }
              }}
            >
              INTERESTED
          </Button>
        </CardContent>
      </Card>

      {/* Interested Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Express Interest</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Send a notification to {job.seekerId?.name || 'the poster'} about this job.
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            label="Your Offer ($)"
            type="number"
            fullWidth
            variant="outlined"
            value={offerAmount}
            onChange={(e) => setOfferAmount(e.target.value)}
            sx={{ mb: 2, mt: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Message (Optional)"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hi, I'm interested in this job..."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button 
            onClick={handleSend} 
            variant="contained" 
            sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: '#333' } }}
          >
            Send Notification
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JobCard;
