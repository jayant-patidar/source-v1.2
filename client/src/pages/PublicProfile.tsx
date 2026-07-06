import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, Avatar, Chip, CircularProgress, Alert, Grid, Button, Divider, Tabs, Tab, Rating } from '@mui/material';
import api from '../services/api';
import { format } from 'date-fns';
import WorkIcon from '@mui/icons-material/Work';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReplyIcon from '@mui/icons-material/Reply';
import TrustBadge from '../components/TrustBadge';

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
    seekerId: string;
    providerId: string;
  };
  response?: {
    message: string;
    createdAt: string;
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
          api.get(`/users/${id}`),
          api.get(`/reviews/${id}`)
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
  if (error) return (
    <Container sx={{ mt: 4, textAlign: 'center', py: 8 }}>
      <Alert severity="info" sx={{ maxWidth: 500, mx: 'auto' }}>
        {error}
      </Alert>
    </Container>
  );
  if (!profileUser) return <Container sx={{ mt: 4 }}><Typography>User not found</Typography></Container>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Header Section */}
      <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', mb: 4, border: '1px solid rgba(0,0,0,0.05)', bgcolor: '#ffffff' }}>
        {/* Cover Photo */}
        <Box 
          sx={{ 
            height: 240, 
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            position: 'relative'
          }}
        />
        
        {/* Profile Content */}
        <Box sx={{ px: { xs: 2, md: 5 }, pb: 4, position: 'relative' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'flex-end' }, mt: -10, mb: 3 }}>
            <Avatar 
              src={profileUser.avatar} 
              alt={profileUser.name}
              sx={{ 
                width: 160, 
                height: 160, 
                border: '6px solid white', 
                bgcolor: '#4f46e5', 
                fontSize: '4rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              }}
            >
              {profileUser.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ ml: { xs: 0, md: 4 }, mt: { xs: 2, md: 0 }, textAlign: { xs: 'center', md: 'left' }, mb: 2 }}>
              <Typography variant="h4" fontWeight="900" sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>{profileUser.name}</Typography>
              <Typography variant="body1" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 1, mt: 0.5, fontWeight: 600 }}>
                <CalendarTodayIcon fontSize="small" /> Member since {profileUser.createdAt ? format(new Date(profileUser.createdAt), 'MMMM yyyy') : 'N/A'}
              </Typography>
            </Box>
          </Box>

          {/* Ratings Summary */}
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 2, mt: 2, alignItems: 'center', flexWrap: 'wrap' }}>
             <TrustBadge score={profileUser.trustScore} isVerified={profileUser.isVerified} />
             <Chip 
                label={`Seeker: ${profileUser.seekerRating !== undefined ? Number(profileUser.seekerRating).toFixed(1) : 'N/A'} ★`} 
                sx={{ fontWeight: 800, borderRadius: 2, bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5' }}
              />
              <Chip 
                label={`Provider: ${profileUser.providerRating !== undefined ? Number(profileUser.providerRating).toFixed(1) : 'N/A'} ★`} 
                sx={{ fontWeight: 800, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}
              />
          </Box>
        </Box>
        
        {/* Tabs */}
        <Divider sx={{ borderColor: 'rgba(0,0,0,0.05)' }} />
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          centered 
          TabIndicatorProps={{ style: { height: 4, borderRadius: '4px 4px 0 0', backgroundColor: '#6366f1' } }}
          sx={{ '& .MuiTab-root': { fontWeight: 800, fontSize: '1rem', textTransform: 'none', color: '#64748b' }, '& .Mui-selected': { color: '#0f172a !important' } }}
        >
            <Tab label="Profile" />
            <Tab label={`Reviews (${reviews.length})`} />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      {tabValue === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* About Section */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', bgcolor: '#ffffff' }}>
                <Typography variant="h6" fontWeight="900" sx={{ color: '#0f172a', mb: 2 }}>About</Typography>
                <Typography variant="body1" paragraph sx={{ color: '#475569', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                    {profileUser.about || "This user hasn't written a bio yet."}
                </Typography>
            </Paper>

            {/* Skills Section */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', bgcolor: '#ffffff' }}>
                <Typography variant="h6" fontWeight="900" sx={{ color: '#0f172a', mb: 3 }}>Skills</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {profileUser.skills && profileUser.skills.length > 0 ? (
                        profileUser.skills.map((skill: string, index: number) => (
                            <Chip key={index} label={skill} sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', fontWeight: 800, borderRadius: 2, px: 1, py: 2.5 }} />
                        ))
                    ) : (
                        <Typography sx={{ color: '#94a3b8', fontStyle: 'italic' }}>No skills listed.</Typography>
                    )}
                </Box>
            </Paper>

            {/* Preferences Section */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', bgcolor: '#ffffff' }}>
                <Typography variant="h6" fontWeight="900" sx={{ color: '#0f172a', mb: 3 }}>Preferences</Typography>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 3, bgcolor: '#f8fafc', border: '1px solid rgba(0,0,0,0.02)' }}>
                            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#059669', display: 'flex' }}>
                                <AttachMoneyIcon />
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Min Pay</Typography>
                                <Typography variant="subtitle1" fontWeight="800" sx={{ color: '#1e293b' }}>
                                    {profileUser.preferences?.minPay ? `$${profileUser.preferences.minPay}/hr` : 'Not specified'}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 3, bgcolor: '#f8fafc', border: '1px solid rgba(0,0,0,0.02)' }}>
                            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex' }}>
                                <LocationOnIcon />
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</Typography>
                                <Typography variant="subtitle1" fontWeight="800" sx={{ color: '#1e293b' }}>
                                    {profileUser.preferences?.location || 'Not specified'}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 3, bgcolor: '#f8fafc', border: '1px solid rgba(0,0,0,0.02)' }}>
                            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex' }}>
                                <CalendarTodayIcon />
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Availability</Typography>
                                <Typography variant="subtitle1" fontWeight="800" sx={{ color: '#1e293b' }}>
                                    {profileUser.availability || 'Not specified'}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Portfolio Section */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', bgcolor: '#ffffff' }}>
                <Typography variant="h6" fontWeight="900" sx={{ color: '#0f172a', mb: 3 }}>Portfolio</Typography>
                <Grid container spacing={3}>
                    {profileUser.portfolio && profileUser.portfolio.length > 0 ? (
                        profileUser.portfolio.map((item: any, index: number) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.06)' } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', display: 'flex' }}>
                                            <WorkIcon fontSize="small" />
                                        </Box>
                                        <Typography variant="subtitle1" fontWeight="800" noWrap>
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#0f172a' }}>
                                                {item.title}
                                            </a>
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {item.description}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))
                    ) : (
                        <Grid size={{ xs: 12 }}>
                            <Typography sx={{ color: '#94a3b8', fontStyle: 'italic' }}>No portfolio items.</Typography>
                        </Grid>
                    )}
                </Grid>
            </Paper>

            {/* Connect Section */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', bgcolor: '#ffffff' }}>
                <Typography variant="h6" fontWeight="900" sx={{ color: '#0f172a', mb: 3 }}>Connect</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {profileUser.socialLinks?.linkedin && (
                        <Button variant="outlined" startIcon={<LinkedInIcon />} href={profileUser.socialLinks.linkedin} target="_blank" sx={{ borderRadius: 2, fontWeight: 800, color: '#0a66c2', borderColor: 'rgba(10, 102, 194, 0.3)', bgcolor: 'rgba(10, 102, 194, 0.05)', '&:hover': { bgcolor: 'rgba(10, 102, 194, 0.1)', borderColor: '#0a66c2' }, minWidth: 120 }}>
                            LinkedIn
                        </Button>
                    )}
                    {profileUser.socialLinks?.github && (
                        <Button variant="outlined" startIcon={<GitHubIcon />} href={profileUser.socialLinks.github} target="_blank" sx={{ borderRadius: 2, fontWeight: 800, color: '#24292e', borderColor: 'rgba(36, 41, 46, 0.3)', bgcolor: 'rgba(36, 41, 46, 0.05)', '&:hover': { bgcolor: 'rgba(36, 41, 46, 0.1)', borderColor: '#24292e' }, minWidth: 120 }}>
                            GitHub
                        </Button>
                    )}
                    {profileUser.socialLinks?.website && (
                        <Button variant="outlined" startIcon={<LanguageIcon />} href={profileUser.socialLinks.website} target="_blank" sx={{ borderRadius: 2, fontWeight: 800, color: '#4f46e5', borderColor: 'rgba(79, 70, 229, 0.3)', bgcolor: 'rgba(79, 70, 229, 0.05)', '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.1)', borderColor: '#4f46e5' }, minWidth: 120 }}>
                            Website
                        </Button>
                    )}
                    {(!profileUser.socialLinks?.linkedin && !profileUser.socialLinks?.github && !profileUser.socialLinks?.website) && (
                        <Typography sx={{ color: '#94a3b8', fontStyle: 'italic' }}>No social links provided.</Typography>
                    )}
                </Box>
            </Paper>
        </Box>
      )}

      {tabValue === 1 && (
          <Box>
            {reviews.length === 0 ? (
                <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 4, border: '1px dashed #e2e8f0', bgcolor: '#f8fafc' }}>
                    <Typography variant="h6" sx={{ color: '#64748b', fontStyle: 'italic' }}>No reviews yet.</Typography>
                </Paper>
            ) : (
                <Grid container spacing={4}>
                    {/* Reviews as Seeker */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid rgba(79, 70, 229, 0.2)', borderRadius: 4, bgcolor: '#eef2ff' }}>
                             <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <Typography variant="h6" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4338ca' }}>
                                     <WorkIcon /> Reviews as Seeker
                                 </Typography>
                                 <Chip label={`${reviews.filter(r => r.job?.seekerId === id).length} reviews`} size="small" sx={{ bgcolor: '#6366f1', color: 'white', fontWeight: 800 }} />
                             </Box>
                            
                            <Box sx={{ maxHeight: '600px', overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(99, 102, 241, 0.3)', borderRadius: 10 } }}>
                                {reviews.filter(r => r.job?.seekerId === id).length === 0 ? (
                                    <Box py={4} textAlign="center">
                                        <Typography sx={{ color: '#4338ca', fontStyle: 'italic', fontSize: '0.95rem' }}>No reviews received as Seeker.</Typography>
                                    </Box>
                                ) : (
                                    reviews.filter(r => r.job?.seekerId === id).map((review) => (
                                        <Paper key={review._id} elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: '#ffffff', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ width: 40, height: 40, bgcolor: '#4f46e5', fontWeight: 800 }}>
                                                        {review.reviewer?.name?.charAt(0).toUpperCase() || '?'}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#1e293b' }}>
                                                            {review.reviewer?.name || 'Unknown User'}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                                            {format(new Date(review.createdAt), 'MMM d, yyyy')}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Rating value={review.rating} readOnly size="small" sx={{ color: '#f59e0b' }} />
                                            </Box>
                                            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: '#475569', lineHeight: 1.6 }}>"{review.comment}"</Typography>
                                            {review.job && (
                                                <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#64748b', fontWeight: 700 }}>
                                                    Job: <span style={{ color: '#4f46e5' }}>{review.job.title}</span>
                                                </Typography>
                                            )}
                                            {review.response && (
                                                <Paper elevation={0} sx={{ p: 2, mt: 2, bgcolor: '#f8fafc', display: 'flex', gap: 1.5, borderLeft: '3px solid #6366f1', borderRadius: '0 12px 12px 0' }}>
                                                    <ReplyIcon sx={{ color: '#6366f1' }} fontSize="small" />
                                                    <Box>
                                                        <Typography variant="caption" fontWeight="800" sx={{ color: '#475569', display: 'block', mb: 0.5 }}>Reply from {profileUser?.name}</Typography>
                                                        <Typography variant="body2" sx={{ color: '#1e293b', fontSize: '0.9rem' }}>{review.response.message}</Typography>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, mt: 0.5, display: 'block' }}>{format(new Date(review.response.createdAt), 'MMM d, yyyy')}</Typography>
                                                    </Box>
                                                </Paper>
                                            )}
                                        </Paper>
                                    ))
                                )}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Reviews as Provider */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 4, bgcolor: '#f0fdf4' }}>
                            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <Typography variant="h6" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#047857' }}>
                                     <WorkIcon /> Reviews as Provider
                                 </Typography>
                                 <Chip label={`${reviews.filter(r => r.job?.providerId === id).length} reviews`} size="small" sx={{ bgcolor: '#10b981', color: 'white', fontWeight: 800 }} />
                             </Box>

                            <Box sx={{ maxHeight: '600px', overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(16, 185, 129, 0.3)', borderRadius: 10 } }}>
                                {reviews.filter(r => r.job?.providerId === id).length === 0 ? (
                                    <Box py={4} textAlign="center">
                                        <Typography sx={{ color: '#047857', fontStyle: 'italic', fontSize: '0.95rem' }}>No reviews received as Provider.</Typography>
                                    </Box>
                                ) : (
                                    reviews.filter(r => r.job?.providerId === id).map((review) => (
                                        <Paper key={review._id} elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: '#ffffff', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ width: 40, height: 40, bgcolor: '#10b981', fontWeight: 800 }}>
                                                        {review.reviewer?.name?.charAt(0).toUpperCase() || '?'}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#1e293b' }}>
                                                            {review.reviewer?.name || 'Unknown User'}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                                            {format(new Date(review.createdAt), 'MMM d, yyyy')}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Rating value={review.rating} readOnly size="small" sx={{ color: '#f59e0b' }} />
                                            </Box>
                                            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: '#475569', lineHeight: 1.6 }}>"{review.comment}"</Typography>
                                            {review.job && (
                                                <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#64748b', fontWeight: 700 }}>
                                                    Job: <span style={{ color: '#059669' }}>{review.job.title}</span>
                                                </Typography>
                                            )}
                                            {review.response && (
                                                <Paper elevation={0} sx={{ p: 2, mt: 2, bgcolor: '#f8fafc', display: 'flex', gap: 1.5, borderLeft: '3px solid #10b981', borderRadius: '0 12px 12px 0' }}>
                                                    <ReplyIcon sx={{ color: '#10b981' }} fontSize="small" />
                                                    <Box>
                                                        <Typography variant="caption" fontWeight="800" sx={{ color: '#475569', display: 'block', mb: 0.5 }}>Reply from {profileUser?.name}</Typography>
                                                        <Typography variant="body2" sx={{ color: '#1e293b', fontSize: '0.9rem' }}>{review.response.message}</Typography>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, mt: 0.5, display: 'block' }}>{format(new Date(review.response.createdAt), 'MMM d, yyyy')}</Typography>
                                                    </Box>
                                                </Paper>
                                            )}
                                        </Paper>
                                    ))
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            )}
          </Box>
      )}
    </Container>
  );
};

export default PublicProfile;
