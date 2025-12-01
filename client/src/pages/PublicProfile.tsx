import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Paper, Avatar, Chip, CircularProgress, Alert, Grid, Button, Divider, Tabs, Tab, Rating } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import WorkIcon from '@mui/icons-material/Work';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  reviewer: {
    _id: string;
    name: string;
  };
  job?: {
    _id: string;
    title: string;
  };
  createdAt: string;
}

const PublicProfile = () => {
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, reviewsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/${id}`, { withCredentials: true }),
          axios.get(`http://localhost:5000/api/reviews/${id}`, { withCredentials: true })
        ]);
        setProfileUser(userRes.data);
        setReviews(reviewsRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load user profile');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
  if (!profileUser) return <Container sx={{ mt: 4 }}><Typography>User not found</Typography></Container>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Header Section */}
      <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
        {/* Cover Photo */}
        <Box 
          sx={{ 
            height: 200, 
            background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
            position: 'relative'
          }}
        />
        
        {/* Profile Content */}
        <Box sx={{ px: { xs: 2, md: 4 }, pb: 4, position: 'relative' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'flex-end' }, mt: -8, mb: 2 }}>
            <Avatar 
              src={profileUser.avatar} 
              alt={profileUser.name}
              sx={{ 
                width: 160, 
                height: 160, 
                border: '5px solid white', 
                bgcolor: 'primary.main', 
                fontSize: '4rem',
                boxShadow: 3
              }}
            >
              {profileUser.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ ml: { xs: 0, md: 3 }, mt: { xs: 2, md: 0 }, textAlign: { xs: 'center', md: 'left' }, mb: 2 }}>
              <Typography variant="h4" fontWeight="bold">{profileUser.name}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 1 }}>
                <CalendarTodayIcon fontSize="small" /> Member since {profileUser.createdAt ? format(new Date(profileUser.createdAt), 'MMMM yyyy') : 'N/A'}
              </Typography>
            </Box>
          </Box>

          {/* Ratings Summary */}
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 2, mt: 2 }}>
             <Chip 
                label={`Seeker: ${profileUser.seekerRating !== undefined ? Number(profileUser.seekerRating).toFixed(1) : 'N/A'} ★`} 
                color="primary" 
                variant="outlined" 
                sx={{ fontWeight: 'bold' }}
              />
              <Chip 
                label={`Provider: ${profileUser.providerRating !== undefined ? Number(profileUser.providerRating).toFixed(1) : 'N/A'} ★`} 
                color="secondary" 
                variant="outlined" 
                sx={{ fontWeight: 'bold' }}
              />
          </Box>
        </Box>
        
        {/* Tabs */}
        <Divider />
        <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ '& .MuiTab-root': { fontWeight: 'bold', fontSize: '1rem' } }}>
            <Tab label="Profile" />
            <Tab label={`Reviews (${reviews.length})`} />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      {tabValue === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* About Section */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>About</Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                    {profileUser.about || "This user hasn't written a bio yet."}
                </Typography>
            </Paper>

            {/* Skills Section */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Skills</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profileUser.skills && profileUser.skills.length > 0 ? (
                        profileUser.skills.map((skill: string, index: number) => (
                            <Chip key={index} label={skill} color="primary" variant="soft" sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 600 }} />
                        ))
                    ) : (
                        <Typography color="text.secondary">No skills listed.</Typography>
                    )}
                </Box>
            </Paper>

            {/* Preferences Section */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Preferences</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <AttachMoneyIcon color="action" />
                            <Box>
                                <Typography variant="caption" color="text.secondary">Min Pay</Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    {profileUser.preferences?.minPay ? `$${profileUser.preferences.minPay}/hr` : 'Not specified'}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <LocationOnIcon color="action" />
                            <Box>
                                <Typography variant="caption" color="text.secondary">Preferred Location</Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    {profileUser.preferences?.location || 'Not specified'}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CalendarTodayIcon color="action" />
                            <Box>
                                <Typography variant="caption" color="text.secondary">Availability</Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    {profileUser.availability || 'Not specified'}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Portfolio Section */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Portfolio</Typography>
                <Grid container spacing={2}>
                    {profileUser.portfolio && profileUser.portfolio.length > 0 ? (
                        profileUser.portfolio.map((item: any, index: number) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Paper variant="outlined" sx={{ p: 2, height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <WorkIcon color="primary" fontSize="small" />
                                        <Typography variant="subtitle2" fontWeight="bold" noWrap>
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {item.title}
                                            </a>
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {item.description}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography color="text.secondary">No portfolio items.</Typography>
                        </Grid>
                    )}
                </Grid>
            </Paper>

            {/* Connect Section */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Connect</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {profileUser.socialLinks?.linkedin && (
                        <Button variant="outlined" startIcon={<LinkedInIcon />} href={profileUser.socialLinks.linkedin} target="_blank" sx={{ minWidth: 120 }}>
                            LinkedIn
                        </Button>
                    )}
                    {profileUser.socialLinks?.github && (
                        <Button variant="outlined" startIcon={<GitHubIcon />} href={profileUser.socialLinks.github} target="_blank" sx={{ color: '#333', borderColor: '#333', minWidth: 120 }}>
                            GitHub
                        </Button>
                    )}
                    {profileUser.socialLinks?.website && (
                        <Button variant="outlined" startIcon={<LanguageIcon />} href={profileUser.socialLinks.website} target="_blank" color="secondary" sx={{ minWidth: 120 }}>
                            Website
                        </Button>
                    )}
                    {(!profileUser.socialLinks?.linkedin && !profileUser.socialLinks?.github && !profileUser.socialLinks?.website) && (
                        <Typography color="text.secondary" variant="body2">No social links provided.</Typography>
                    )}
                </Box>
            </Paper>
        </Box>
      )}

      {tabValue === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {reviews.length === 0 ? (
                  <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px solid #e0e0e0' }}>
                      <Typography variant="h6" color="text.secondary">No reviews yet.</Typography>
                  </Paper>
              ) : (
                  reviews.map((review) => (
                      <Paper key={review._id} elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                      {review.reviewer?.name?.charAt(0).toUpperCase() || '?'}
                                  </Avatar>
                                  <Box>
                                      <Typography variant="subtitle1" fontWeight="bold">
                                          {review.reviewer?.name || 'Unknown User'}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                          {format(new Date(review.createdAt), 'MMM d, yyyy')}
                                          {review.job && ` • Job: ${review.job.title}`}
                                      </Typography>
                                  </Box>
                              </Box>
                              <Rating value={review.rating} readOnly size="small" />
                          </Box>
                          <Typography variant="body1">{review.comment}</Typography>
                      </Paper>
                  ))
              )}
          </Box>
      )}
    </Container>
  );
};

export default PublicProfile;
