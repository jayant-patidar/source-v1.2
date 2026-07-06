import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper, Divider, Chip, CircularProgress, Avatar, Alert, Grid } from '@mui/material';
import { getGigById } from '../services/gig.service';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CategoryIcon from '@mui/icons-material/Category';
import SendIcon from '@mui/icons-material/Send';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { format, formatDistanceToNow } from 'date-fns';
import BookGigModal from '../components/BookGigModal';

const GigDetails = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { showToast } = useToastStore();

  const requireAuth = (action: () => void) => {
    if (!user) {
      showToast('Please login', 'warning');
      return;
    }
    action();
  };

  const [gig, setGig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        if (!id) return;
        const data = await getGigById(id);
        setGig(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load gig details');
        setLoading(false);
      }
    };
    fetchGig();
  }, [id]);

  const handleSave = async () => {
    showToast('Save Gig functionality coming soon!', 'info');
    setIsSaved(!isSaved);
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Container><Alert severity="error">{error}</Alert></Container>;
  if (!gig) return <Container><Typography>Gig not found</Typography></Container>;

  const isPoster = user && (gig.providerId === user._id || (gig.providerId && gig.providerId._id === user._id));
  const provider = gig.providerId;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Back Button */}
      <Box sx={{ mb: 2 }}>
        <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ color: 'text.secondary', fontWeight: 700 }}>
          Back to Gigs
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: 4, 
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
            bgcolor: '#ffffff',
            position: 'relative',
            overflow: 'hidden'
          }}>
        
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: { xs: 'wrap', md: 'nowrap' }, gap: 2 }}>
            <Box sx={{ flex: 1 }}>
                <Typography variant="h3" fontWeight="900" sx={{ 
                  fontSize: { xs: '1.75rem', md: '2.5rem' }, 
                  lineHeight: 1.2, 
                  mb: 1,
                  letterSpacing: '-1px'
                }}>
                {gig.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: '#94a3b8', fontWeight: 600 }}>
                    Posted {formatDistanceToNow(new Date(gig.createdAt))} ago
                </Typography>
            </Box>
            
            {/* Prominent Pay Display */}
            <Box sx={{ textAlign: { xs: 'left', md: 'right' }, minWidth: 120 }}>
                <Box sx={{ display: 'inline-block', bgcolor: 'rgba(16, 185, 129, 0.1)', px: 2, py: 1, borderRadius: 2 }}>
                    <Typography variant="h4" fontWeight="900" sx={{ color: '#10b981' }}>
                        ${gig.price}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1, mt: 1 }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, letterSpacing: '0.5px' }}>
                        FIXED PRICE
                    </Typography>
                </Box>
            </Box>
          </Box>

          {/* Key Info Chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            <Chip 
              icon={<CategoryIcon sx={{ fontSize: 18, color: '#6366f1 !important' }} />}
              label={gig.category} 
              sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', fontWeight: '800', fontSize: '0.85rem', py: 0.5, borderRadius: 2 }} 
            />
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Description Section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Service Description
          </Typography>
          <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {gig.description}
          </Typography>
        </Box>

        {gig.tags && gig.tags.length > 0 && (
            <Box sx={{ mb: 5 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {gig.tags.map((tag: string, index: number) => (
                        <Chip
                            key={index}
                            label={tag}
                            sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', fontWeight: '800', borderRadius: 2 }}
                        />
                    ))}
                </Box>
            </Box>
        )}

        <Box sx={{ mb: 5, bgcolor: '#f8fafc', p: 3, borderRadius: 3, border: '1px solid #f1f5f9' }}>
          <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', fontWeight: 600 }}>
            * Date, Time, and Location will be specified by you during the booking process.
          </Typography>
        </Box>
          </Paper>
        </Grid>

        {/* Right Column (Sticky Sidebar) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Action Buttons & Book Button */}
            {!isPoster && (
            <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#ffffff', borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                {/* Actions Icons Row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, mb: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => requireAuth(() => showToast('Share functionality coming soon!', 'info'))}>
                        <Box sx={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'white', border: '1px solid #f1f5f9', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(236, 72, 153, 0.1)', transform: 'translateY(-2px)', borderColor: 'transparent' } }}>
                          <SendIcon sx={{ fontSize: 20, color: '#db2777' }} />
                        </Box>
                        <Typography variant="caption" sx={{ fontSize: '0.75rem', mt: 1, fontWeight: '800', color: '#64748b' }}>Share</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => requireAuth(handleSave)}>
                        <Box sx={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: isSaved ? 'rgba(245, 158, 11, 0.15)' : 'white', border: isSaved ? 'transparent' : '1px solid #f1f5f9', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.1)', transform: 'translateY(-2px)', borderColor: 'transparent' } }}>
                          {isSaved ? <BookmarkIcon sx={{ fontSize: 20, color: '#d97706' }} /> : <BookmarkBorderIcon sx={{ fontSize: 20, color: '#d97706' }} />}
                        </Box>
                        <Typography variant="caption" sx={{ fontSize: '0.75rem', mt: 1, fontWeight: '800', color: isSaved ? '#d97706' : '#64748b' }}>{isSaved ? 'Saved' : 'Save'}</Typography>
                    </Box>
                </Box>

                {/* Book Button */}
                <Button 
                    fullWidth
                    variant="contained" 
                    size="large"
                    onClick={() => requireAuth(() => setIsBookModalOpen(true))}
                    sx={{ 
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                        color: 'white', 
                        fontWeight: '900', 
                        py: 1.5,
                        borderRadius: 3,
                        fontSize: '1.1rem',
                        letterSpacing: '0.5px',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                        '&:hover': { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', transform: 'translateY(-2px)', boxShadow: '0 12px 25px rgba(0,0,0,0.3)' },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    BOOK NOW
                </Button>
            </Box>
        )}

        {/* Provider Details (Sidebar) */}
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, bgcolor: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
             <Typography variant="subtitle2" fontWeight="900" sx={{ letterSpacing: '0.5px', color: '#64748b', width: '100%', textAlign: 'left' }}>
                ABOUT THE PROVIDER
            </Typography>

                <Box sx={{ p: 0.5, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>
                  <Avatar 
                      src={provider?.avatar} 
                      alt={provider?.name}
                      sx={{ width: 80, height: 80, border: '4px solid #fff' }}
                  >
                      {provider?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <Typography variant="h6" fontWeight="900" component={Link} to={`/profile/${provider?._id}`} sx={{ textDecoration: 'none', color: '#0f172a', '&:hover': { color: '#6366f1' }, transition: 'color 0.2s', mb: 2 }}>
                        {provider?.name}
                    </Typography>
                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', mb: 2, bgcolor: '#f8fafc', p: 1.5, borderRadius: 2 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, display: 'block' }}>PROVIDER</Typography>
                            <Typography variant="body2" fontWeight="900" sx={{ color: '#0f172a' }}>★ {provider?.providerRating?.toFixed(1) || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, display: 'block' }}>SEEKER</Typography>
                            <Typography variant="body2" fontWeight="900" sx={{ color: '#0f172a' }}>★ {provider?.seekerRating?.toFixed(1) || 'N/A'}</Typography>
                        </Box>
                    </Box>
                     <Box sx={{ width: '100%', textAlign: 'center', mb: 2 }}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, display: 'block' }}>MEMBER SINCE</Typography>
                        <Typography variant="body2" fontWeight="800" sx={{ color: '#0f172a' }}>{provider?.createdAt ? format(new Date(provider.createdAt), 'MMM yyyy') : 'N/A'}</Typography>
                    </Box>
                    <Button component={Link} to={`/profile/${provider?._id}`} variant="outlined" fullWidth sx={{ borderRadius: 3, fontWeight: 800, color: '#0f172a', borderColor: '#cbd5e1', '&:hover': { borderColor: '#94a3b8', bgcolor: '#f1f5f9' } }}>
                        View Profile
                    </Button>
                </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Book Gig Modal */}
      <BookGigModal 
        open={isBookModalOpen} 
        onClose={() => setIsBookModalOpen(false)} 
        gig={gig} 
      />
    </Container>
  );
};

export default GigDetails;
