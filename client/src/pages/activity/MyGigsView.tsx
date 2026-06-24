import { useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useGigStore } from '../../store/gigStore';
import GigCard from '../../components/GigCard';

const MyGigsView = () => {
  const navigate = useNavigate();
  const { myGigs, isLoading, fetchMyGigs } = useGigStore();

  useEffect(() => {
    fetchMyGigs();
  }, [fetchMyGigs]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          My Gigs
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/create-gig')}
          sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: '#333' } }}
        >
          Post a Gig
        </Button>
      </Box>

      {myGigs.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 6, bgcolor: 'white', borderRadius: 2, border: '1px solid #eee' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You haven't posted any Gigs yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create service packages for Seekers to easily book your expertise.
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => navigate('/create-gig')}>
            Create Your First Gig
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {myGigs.map((gig: any) => (
            <Grid size={{ xs: 12, md: 6 }} key={gig._id}>
              <GigCard gig={gig} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyGigsView;
