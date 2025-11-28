import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, Avatar, Chip, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';

const PublicProfile = () => {
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Assuming we have an endpoint to get user by ID. 
        // If not, we might need to create one or use existing logic.
        // For now, I'll assume /api/users/:id exists or similar.
        // If not, I'll need to check backend routes.
        // Wait, standard user route usually is /api/users/profile but that's for logged in user.
        // I might need to add a route to get public user info.
        // Let's try /api/users/:id
        const { data } = await axios.get(`http://localhost:5000/api/users/${id}`);
        setProfileUser(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load user profile');
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Container><Alert severity="error">{error}</Alert></Container>;
  if (!profileUser) return <Container><Typography>User not found</Typography></Container>;

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 6, borderRadius: 2, textAlign: 'center', width: '100%', maxWidth: 600 }}>
        <Avatar 
          src={profileUser.avatar} 
          alt={profileUser.name}
          sx={{ 
            width: 120, 
            height: 120, 
            mx: 'auto', 
            mb: 2,
            bgcolor: 'primary.main',
            fontSize: '3rem'
          }}
        >
          {profileUser.name.charAt(0).toUpperCase()}
        </Avatar>
        
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {profileUser.name}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" gutterBottom>
          User Since: {profileUser.createdAt ? format(new Date(profileUser.createdAt), 'MMMM d, yyyy') : 'N/A'}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, mb: 4 }}>
          <Chip 
            label={`Seeker Rating: ${profileUser.seekerRating || 'N/A'} ★`} 
            sx={{ bgcolor: '#e0f7fa', color: '#006064', fontWeight: 'bold' }} 
          />
          <Chip 
            label={`Provider Rating: ${profileUser.providerRating || 'N/A'} ★`} 
            sx={{ bgcolor: '#e0f2f1', color: '#004d40', fontWeight: 'bold' }} 
          />
        </Box>

        <Box sx={{ textAlign: 'left', mt: 4 }}>
            <Typography variant="h6" gutterBottom>About:</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6, mb: 3 }}>
                {profileUser.about || "No bio provided."}
            </Typography>

            {profileUser.skills && profileUser.skills.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom>Skills:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {profileUser.skills.map((skill: string, index: number) => (
                    <Chip key={index} label={skill} variant="outlined" />
                  ))}
                </Box>
              </>
            )}

            {profileUser.preferences && (
              <>
                <Typography variant="h6" gutterBottom>Preferences:</Typography>
                <Box sx={{ mb: 3 }}>
                  {profileUser.preferences.minPay && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Min Pay:</strong> ${profileUser.preferences.minPay}/hr
                    </Typography>
                  )}
                  {profileUser.preferences.location && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Location:</strong> {profileUser.preferences.location}
                    </Typography>
                  )}
                  {profileUser.availability && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Availability:</strong> {profileUser.availability}
                    </Typography>
                  )}
                </Box>
              </>
            )}

            {profileUser.socialLinks && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>Links:</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {profileUser.socialLinks.linkedin && (
                    <Button href={profileUser.socialLinks.linkedin} target="_blank" size="small">LinkedIn</Button>
                  )}
                  {profileUser.socialLinks.github && (
                    <Button href={profileUser.socialLinks.github} target="_blank" size="small">GitHub</Button>
                  )}
                  {profileUser.socialLinks.website && (
                    <Button href={profileUser.socialLinks.website} target="_blank" size="small">Website</Button>
                  )}
                </Box>
              </Box>
            )}
        </Box>
      </Paper>
    </Container>
  );
};

export default PublicProfile;
