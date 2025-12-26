import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import SavedJobCard from '../../components/SavedJobCard';
import { jobService } from '../../services/job.service';

const SavedJobsView = () => {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const data = await jobService.getSavedJobs();
        setSavedJobs(data);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  if (savedJobs.length === 0) {
    return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">No saved jobs yet.</Typography>
            <Typography variant="body2" color="text.secondary">Jobs you save will appear here for easy access.</Typography>
        </Box>
    );
  }

  return (
    <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Saved Jobs</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>Your bookmarked opportunities.</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {savedJobs.map((job) => (
                <Box key={job._id} sx={{ width: '100%' }}>
                    <SavedJobCard 
                        job={job} 
                        onUnsave={(jobId) => setSavedJobs(prev => prev.filter(j => j._id !== jobId))} 
                    />
                </Box>
            ))}
        </Box>
    </Box>
  );
};

export default SavedJobsView;
