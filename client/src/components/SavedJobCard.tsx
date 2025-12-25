import { Card, CardContent, Typography, Box, Chip, Avatar, IconButton, Snackbar } from '@mui/material';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

interface SavedJobCardProps {
  job: any;
  onUnsave: (jobId: string) => void;
}

import { jobService } from '../services/job.service';

const SavedJobCard = ({ job, onUnsave }: SavedJobCardProps) => {
  const [isSaved, setIsSaved] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleToggleSave = async () => {
    try {
      await jobService.toggleSaveJob(job._id);
      const newSavedState = !isSaved;
      setIsSaved(newSavedState);
      setSnackbarOpen(true);
      
      // If we are unsaving, notify the parent after a delay or immediately
      if (!newSavedState) {
          // Optional: wait for snackbar or animation, but for now immediate update is fine
          // or let the user see the "Unsaved" state briefly
          setTimeout(() => {
              onUnsave(job._id);
          }, 500); 
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  return (
    <>
      <Card sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #e0e0e0', transition: '0.2s', '&:hover': { borderColor: '#000' }, width: '100%' }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          
          {/* Top Row: Title & Save Icon */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem', lineHeight: 1.2, '&:hover': { textDecoration: 'underline' } }}>
                {job.title}
              </Typography>
            </Link>
            <IconButton onClick={handleToggleSave} size="small" sx={{ ml: 1, mt: -0.5 }}>
                {isSaved ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
            </IconButton>
          </Box>

          {/* Pay & Type */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
             <Chip 
                label={`$${job.originalPay}`} 
                size="small"
                sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 'bold', borderRadius: '6px', height: 24 }} 
              />
              <Chip 
                label={job.type === 'hourly' ? 'Hourly' : 'One-Time'} 
                size="small"
                sx={{ bgcolor: '#f5f5f5', color: '#616161', fontWeight: 'bold', borderRadius: '6px', height: 24 }} 
              />
          </Box>

          {/* Seeker Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar 
                src={job.seekerId?.avatar} 
                alt={job.seekerId?.name}
                sx={{ width: 24, height: 24, border: '1px solid #eee' }}
            >
                {job.seekerId?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="caption" color="text.secondary" fontWeight="500">
                {job.seekerId?.name || 'Unknown'} • {job.seekerId?.seekerRating || 'N/A'} ★
            </Typography>
          </Box>

          {/* Footer: Date & Location */}
          <Box sx={{ display: 'flex', gap: 2, color: '#757575' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">
                  {job.jobDate ? format(new Date(job.jobDate), 'MMM d') : 'Flexible'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">
                  {job.location?.general || 'Remote'}
              </Typography>
            </Box>
          </Box>

        </CardContent>
      </Card>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={isSaved ? "Job Saved" : "Job Unsaved"}
      />
    </>
  );
};

export default SavedJobCard;
